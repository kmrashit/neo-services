import mongoose from 'mongoose';
import ProfileViewHistory from './models/profile-view.model';
import SearchHistory from './models/search-history.model';
import { getViewedProfilesBasePipeline, viewedProfilesLookupPipeline, getSearchHistoryBasePipeline, searchHistoryLookupPipeline } from './hr.queries';
import { getDataWithLookupsAfterFilter } from '../../core/core-helper/mongo.helper';
import { IFilter } from '../../interface/common.interface';
import { AppError } from '../../core/core-utils/err-util';
import * as HR_MSGS from './hr.constants';

export class HistoryService {
  async getViewedProfiles(userId: string, filterQuery: IFilter = {}) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const basePipeline = getViewedProfilesBasePipeline(userObjectId);
      return await getDataWithLookupsAfterFilter(
        { page: '1', pageSize: '10', ...filterQuery, sortBy: filterQuery.sortBy || 'viewedAt', sortOrder: 'desc' },
        basePipeline,
        viewedProfilesLookupPipeline,
        [],
        ProfileViewHistory,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_VIEWED_PROFILES, apiName: 'getViewedProfiles' });
    }
  }

  async getSearches(userId: string, filterQuery: IFilter = {}) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);
      const basePipeline = getSearchHistoryBasePipeline(userObjectId);
      return await getDataWithLookupsAfterFilter(
        { page: '1', pageSize: '10', ...filterQuery, sortBy: filterQuery.sortBy || 'searchedAt', sortOrder: 'desc' },
        basePipeline,
        searchHistoryLookupPipeline,
        ['query'],
        SearchHistory,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_SEARCH_HISTORY, apiName: 'getSearches' });
    }
  }
}

