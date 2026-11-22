import api from '../api/api';

// get all connections

export const getConnections = async () => await api.get(
  '/connections/list',
);

// accept reject

export const respondConnection = async (
  id: string,
  action: 'accept' | 'reject',
) => await api.post(

  `/connections/respond/${id}`,

  {
    action,
  },

);

// create connection

export const createConnection = async (
  receiverId: string,
  message: string,
) => await api.post(

  '/connections/connect',

  {
    receiverId,
    message,
  },

);

// chat history

export const getChatHistory = async (
  connectionId: string,
) => await api.get(

  `/connections/chat/history/${connectionId}`,

);

// send message

export const sendMessage = async (
  connectionId: string,
  message: string,
) => await api.post(

  '/connections/chat/send',

  {
    connectionId,
    message,
  },

);

// notifications

export const getNotifications = async () => await api.get(

  '/connections/notifications',

);

export const readNotification = async (
  id: string,
) => await api.post(

  `/connections/notifications/read/${id}`,

);