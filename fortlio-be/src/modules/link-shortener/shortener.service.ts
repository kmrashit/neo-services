import mongoose from 'mongoose';
import { AppError } from '../../core/core-utils/err-util';
import ShortendLink from './models/shortend-link.model';
import { getLinkAnalyticsPipeline, getMyLinksBasePipeline, myLinksLookupPipeline } from './shortener.queries';
import { getDataWithLookupsAfterFilter } from '../../core/core-helper/mongo.helper';
import { IFilter } from '../../interface/common.interface';

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

  async getMyLinks(userId: string, filterQuery: IFilter = {}): Promise<any> {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const basePipeline = getMyLinksBasePipeline(userObjectId);
      return await getDataWithLookupsAfterFilter(
        { page: '1', pageSize: '10', ...filterQuery, sortBy: filterQuery.sortBy || 'createdAt', sortOrder: 'desc' },
        basePipeline,
        myLinksLookupPipeline,
        ['shortCode', 'originalUrl', 'targetType'],
        ShortendLink,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Error fetching my links:', apiName: 'getMyLinks' });
    }
  }
}
