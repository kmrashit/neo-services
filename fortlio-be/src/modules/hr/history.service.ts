import mongoose from 'mongoose';
import ProfileViewHistory from './models/profile-view.model';
import SearchHistory from './models/search-history.model';
import { getViewedProfilesPipeline, getSearchHistoryPipeline } from './hr.queries';
import { AppError } from '../../core/core-utils/err-util';
import * as HR_MSGS from './hr.constants';

export class HistoryService {
  async getViewedProfiles(userId: string) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const pipeline = getViewedProfilesPipeline(userObjectId);
      const results = await ProfileViewHistory.aggregate(pipeline).exec();
      return results;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_VIEWED_PROFILES, apiName: 'getViewedProfiles' });
    }
  }

  async getSearches(userId: string) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const pipeline = getSearchHistoryPipeline(userObjectId);
      return await SearchHistory.aggregate(pipeline).exec();
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_SEARCH_HISTORY, apiName: 'getSearches' });
    }
  }
}

