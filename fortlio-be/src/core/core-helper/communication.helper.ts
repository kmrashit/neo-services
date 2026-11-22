import mongoose from 'mongoose';
import Notification from '../../modules/connection/models/notification.model';
import { sesHelper } from '../../clients';
import { EMAIL_SEND_FROM } from '../core-constants/common.constants';

export interface IUserCommunicationPayload {
  userId: string | mongoose.Types.ObjectId;
  email?: string;
  title: string;
  message: string;
  type?: 'SYSTEM' | 'BILLING' | 'AI_ENGINE' | 'SECURITY';
  metadata?: Record<string, any>;
}

export const dispatchUserCommunication = async (payload: IUserCommunicationPayload) => {
  const { userId, email, title, message, type = 'SYSTEM', metadata = {} } = payload;

  // 1. Web In-App Notification (Stored in MongoDB)
  let webNotif = null;
  try {
    const userObjectId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
    webNotif = await Notification.create({
      userId: userObjectId,
      type,
      title,
      message,
      metadata,
    });
  } catch (err: any) {
    console.warn('Failed to persist web notification:', err.message || err);
  }

  // 2. Email Notification via AWS SES
  if (email && email.includes('@')) {
    try {
      const htmlContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; max-width: 580px; margin: 0 auto; padding: 24px; border: 1px solid #e2e8f0; rounded: 12px; background-color: #ffffff;">
          <div style="display: flex; align-items: center; margin-bottom: 20px;">
            <h2 style="color: #6d28d9; margin: 0; font-size: 20px;">Fortlio Platform Notification</h2>
          </div>
          <h3 style="color: #1e293b; margin-top: 0; font-size: 16px;">${title}</h3>
          <p style="color: #475569; font-size: 14px; line-height: 1.6;">${message}</p>
          <hr style="border: 0; border-top: 1px solid #e2e8f0; margin: 24px 0;" />
          <p style="color: #94a3b8; font-size: 12px; margin: 0;">This official communication was dispatched via Fortlio SES Notification Service.</p>
        </div>
      `;

      await sesHelper.sendSesEmail(
        EMAIL_SEND_FROM,
        email,
        [],
        [],
        `Fortlio: ${title}`,
        [],
        htmlContent,
        message,
      );
    } catch (err: any) {
      console.warn('SES email delivery skipped/failed (Web notification preserved):', err.message || err);
    }
  }

  return webNotif;
};
