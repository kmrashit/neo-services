import mongoose from 'mongoose';
import { AppError } from '../../core/core-utils/err-util';
import ShortendLink from './models/shortend-link.model';
import { getLinkAnalyticsPipeline, getMyLinksPipeline } from './shortener.queries';

export class ShortenerService {
  async fetchUrl(shortValue: string): Promise<string> {
    try {
      const resp = await ShortendLink.findOneAndUpdate(
        { shortCode: shortValue },
        {
          $inc: { accessCount: 1, viewsCount: 1 },
          $set: { lastAccessedAt: new Date() },
        },
        { new: true },
      );
      return resp?.originalUrl || '';
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error fetching short URL:', apiName: 'fetchUrl' });
    }
  }

  async checkIfAvailable(shortValue: string): Promise<boolean> {
    try {
      const resp = await ShortendLink.findOne({ shortCode: shortValue });
      return !Boolean(resp);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error checking short URL availability:', apiName: 'checkIfAvailable' });
    }
  }

  async createShortUrl(
    shortValue: string,
    originalUrl: string,
    createdBy: string | null,
    targetType: 'resume' | 'blog' | 'custom' = 'custom',
    targetId: string | null = null,
  ): Promise<any> {
    try {
      const link = await ShortendLink.create({
        originalUrl,
        shortCode: shortValue,
        createdBy: createdBy ? new mongoose.Types.ObjectId(createdBy) : null,
        targetType,
        targetId: targetId ? new mongoose.Types.ObjectId(targetId) : null,
      });
      return link;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error creating short URL:', apiName: 'createShortUrl' });
    }
  }

  async recordDwellTime(shortCode: string, durationSeconds: number): Promise<boolean> {
    try {
      await ShortendLink.updateOne(
        { shortCode },
        { $inc: { totalTimeSpentSeconds: durationSeconds } },
      );
      return true;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error recording dwell time:', apiName: 'recordDwellTime' });
    }
  }

  async getLinkAnalytics(shortCode: string): Promise<any> {
    try {
      const pipeline = getLinkAnalyticsPipeline(shortCode);
      const results = await ShortendLink.aggregate(pipeline);
      return results?.[0] || null;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error fetching link analytics:', apiName: 'getLinkAnalytics' });
    }
  }

  async getMyLinks(userId: string): Promise<any[]> {
    try {
      const pipeline = getMyLinksPipeline(new mongoose.Types.ObjectId(userId));
      const results = await ShortendLink.aggregate(pipeline);
      return results || [];
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error fetching my links:', apiName: 'getMyLinks' });
    }
  }
}
