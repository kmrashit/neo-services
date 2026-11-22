import mongoose from 'mongoose';
import Connection from './models/connection.model';
import ChatMessage from './models/chat-message.model';
import Notification from './models/notification.model';
import User from '../user/models/user.model';
import { AppError } from '../../core/core-utils/err-util';
import { IFilter } from '../../interface/common.interface';
import { getDataWithLookupsAfterFilter } from '../../core/core-helper/mongo.helper';
import * as CONNECTION_MSGS from './connection.constants';
import { getChatHistoryBasePipeline, getListConnectionsBasePipeline, connectionsLookupPipeline, getListNotificationsBasePipeline } from './connection.queries';
import { wsHandler } from '../../clients';

export class ConnectionService {
  async createConnection(senderId: string, receiverId: string, message?: string) {
    try {
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

      // Check if user is trying to connect with themselves
      if (senderId === receiverId) {
        throw new AppError(CONNECTION_MSGS.ERR.CANNOT_CONNECT_SELF, { apiName: 'createConnection' }, 400);
      }

      // Check if connection already exists
      const existing = await Connection.findOne({
        $or: [
          { senderId: senderObjectId, receiverId: receiverObjectId },
          { senderId: receiverObjectId, receiverId: senderObjectId },
        ],
      });

      if (existing) {
        throw new AppError(CONNECTION_MSGS.ERR.CONNECTION_EXISTS, { apiName: 'createConnection' }, 400);
      }

      const connection = new Connection({
        senderId: senderObjectId,
        receiverId: receiverObjectId,
        message: message || '',
        status: 'pending',
      });

      await connection.save();

      // Send notification to receiver
      const sender = await User.findById(senderObjectId).lean();
      const senderName = sender?.fullName || 'Someone';

      const notification = new Notification({
        userId: receiverObjectId,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${senderName} wants to connect with you.`,
        metadata: {
          connectionId: connection._id,
          senderId: senderObjectId,
        },
      });
      await notification.save();

      return connection;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_CREATE_CONNECTION, apiName: 'createConnection' });
    }
  }

  async respondToConnection(connectionId: string, userId: string, action: 'accept' | 'reject') {
    try {
      const connectionObjectId = new mongoose.Types.ObjectId(connectionId);
      const receiverObjectId = new mongoose.Types.ObjectId(userId);

      const connection = await Connection.findById(connectionObjectId);
      if (!connection) {
        throw new AppError(CONNECTION_MSGS.ERR.REQUEST_NOT_FOUND, { apiName: 'respondToConnection' }, 404);
      }

      if (connection.receiverId.toString() !== userId) {
        throw new AppError(CONNECTION_MSGS.ERR.NOT_RECEIVER_OF_REQUEST, { apiName: 'respondToConnection' }, 403);
      }

      if (connection.status !== 'pending') {
        throw new AppError(CONNECTION_MSGS.ERR.REQUEST_NOT_PENDING, { apiName: 'respondToConnection' }, 400);
      }

      connection.status = action === 'accept' ? 'accepted' : 'rejected';
      await connection.save();

      // If accepted, send notification to sender
      if (action === 'accept') {
        const receiver = await User.findById(receiverObjectId).lean();
        const receiverName = receiver?.fullName || 'Someone';

        const notification = new Notification({
          userId: connection.senderId,
          type: 'connection_accepted',
          title: 'Connection Accepted',
          message: `${receiverName} accepted your connection request.`,
          metadata: {
            connectionId: connection._id,
            receiverId: receiverObjectId,
          },
        });
        await notification.save();
      }

      return connection;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_RESPOND_CONNECTION, apiName: 'respondToConnection' });
    }
  }

  async listConnections(userId: string, status?: string, filterQuery: IFilter = {}) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const basePipeline = getListConnectionsBasePipeline(userObjectId, status);
      const searchFields = ['message', 'status'];
      return await getDataWithLookupsAfterFilter(
        { ...filterQuery, sortBy: filterQuery.sortBy || 'updatedAt' },
        basePipeline,
        connectionsLookupPipeline,
        searchFields,
        Connection,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_LIST_CONNECTIONS, apiName: 'listConnections' });
    }
  }

  async sendMessage(senderId: string, connectionId: string, message: string) {
    try {
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
      const connectionObjectId = new mongoose.Types.ObjectId(connectionId);

      const connection = await Connection.findById(connectionObjectId);
      if (!connection) {
        throw new AppError(CONNECTION_MSGS.ERR.CONNECTION_NOT_FOUND, { apiName: 'sendMessage' }, 404);
      }

      if (connection.status !== 'accepted') {
        throw new AppError(CONNECTION_MSGS.ERR.CONNECTION_NOT_ACCEPTED, { apiName: 'sendMessage' }, 400);
      }

      const isSender = connection.senderId.toString() === senderId;
      const isReceiver = connection.receiverId.toString() === senderId;

      if (!isSender && !isReceiver) {
        throw new AppError(CONNECTION_MSGS.ERR.NOT_PART_OF_CONNECTION, { apiName: 'sendMessage' }, 403);
      }

      const receiverId = isSender ? connection.receiverId : connection.senderId;

      const chatMessage = new ChatMessage({
        connectionId: connectionObjectId,
        senderId: senderObjectId,
        receiverId,
        message,
      });

      await chatMessage.save();

      // Create message notification
      const sender = await User.findById(senderObjectId).lean();
      const senderName = sender?.fullName || 'Someone';

      const notification = new Notification({
        userId: receiverId,
        type: 'new_message',
        title: 'New Chat Message',
        message: `${senderName} sent you a message.`,
        metadata: {
          connectionId: connection._id,
          messageId: chatMessage._id,
        },
      });
      await notification.save();

      // Broadcast chat message to the recipient's topic and connection topic
      const wsPayload = {
        event: 'new_message',
        data: {
          _id: chatMessage._id.toString(),
          connectionId: connection._id.toString(),
          senderId: senderId,
          receiverId: receiverId.toString(),
          message: message,
          createdAt: chatMessage.createdAt,
        },
      };

      try {
        wsHandler.sendToSubscribers(`user_${receiverId}`, wsPayload);
        wsHandler.sendToSubscribers(`connection_${connection._id}`, wsPayload);
      } catch (err: any) {
        console.error('Failed to broadcast message via WebSocket:', err.message || err);
      }

      return chatMessage;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_SEND_MESSAGE, apiName: 'sendMessage' });
    }
  }

  async getChatHistory(connectionId: string, userId: string, page = 1, pageSize = 20) {
    try {
      const connectionObjectId = new mongoose.Types.ObjectId(connectionId);

      const connection = await Connection.findById(connectionObjectId);
      if (!connection) {
        throw new AppError(CONNECTION_MSGS.ERR.CONNECTION_NOT_FOUND, { apiName: 'getChatHistory' }, 404);
      }

      const senderId = connection.senderId;
      const receiverId = connection.receiverId;

      if (senderId.toString() !== userId && receiverId.toString() !== userId) {
        throw new AppError(CONNECTION_MSGS.ERR.NOT_PART_OF_CONNECTION, { apiName: 'getChatHistory' }, 403);
      }

      const basePipeline = getChatHistoryBasePipeline(connectionObjectId, senderId, receiverId);
      return await getDataWithLookupsAfterFilter(
        { page: String(page), pageSize: String(pageSize), sortBy: 'createdAt', sortOrder: 'desc' },
        basePipeline,
        [],
        ['message'],
        ChatMessage,
      );
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_FETCH_HISTORY, apiName: 'getChatHistory' });
    }
  }

  async listNotifications(userId: string, filterQuery: IFilter = {}) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const basePipeline = getListNotificationsBasePipeline(userObjectId);
      return await getDataWithLookupsAfterFilter(
        { pageSize: '50', ...filterQuery, sortBy: filterQuery.sortBy || 'createdAt', sortOrder: 'desc' },
        basePipeline,
        [],
        ['title', 'message', 'type'],
        Notification,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_FETCH_NOTIFICATIONS, apiName: 'listNotifications' });
    }
  }

  async markNotificationAsRead(notificationId: string, userId: string) {
    try {
      const notificationObjectId = new mongoose.Types.ObjectId(notificationId);
      const userObjectId = new mongoose.Types.ObjectId(userId);

      const notification = await Notification.findOne({ _id: notificationObjectId, userId: userObjectId });
      if (!notification) {
        throw new AppError(CONNECTION_MSGS.ERR.NOTIFICATION_NOT_FOUND, { apiName: 'markNotificationAsRead' }, 404);
      }

      notification.isRead = true;
      await notification.save();

      return notification;
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_MARK_NOTIFICATION, apiName: 'markNotificationAsRead' });
    }
  }

  async markAllNotificationsAsRead(userId: string) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      await Notification.updateMany({ userId: userObjectId, isRead: false }, { $set: { isRead: true } });
      return { success: true };
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: CONNECTION_MSGS.ERR.FAILED_TO_MARK_NOTIFICATION, apiName: 'markAllNotificationsAsRead' });
    }
  }
}
