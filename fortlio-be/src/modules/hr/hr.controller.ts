import { Request, Response } from 'express';
import { HrService } from './hr.service';
import { HistoryService } from './history.service';
import { UserService } from '../user/user.service';
import { AuthnService } from '../auth/auth.service';
import { HrProfileUpsertValidation } from './hr.validation';
import { fmtRes } from '../../core/core-utils/res-util';
import { AppError } from '../../core/core-utils/err-util';
import * as HR_MSGS from './hr.constants';
import ProfileViewHistory from './models/profile-view.model';
import SearchHistory from './models/search-history.model';
import { sensiSearch } from '../../clients';
import { TYPSENSE_COLLECTION_NAME } from '../../core/core-constants/common.constants';

export class HrController {
  constructor(
    private hrService: HrService,
    private historyService: HistoryService,
    private userService: UserService,
    private authnService: AuthnService,
  ) { }

  private maskEmail(email: string): string {
    if (!email) {
      return '';
    }
    const [local, domain] = email.split('@');
    if (!domain) {
      return '***';
    }
    if (local.length <= 2) {
      return `${local[0] || ''}***@${domain}`;
    }
    return `${local[0]}***${local[local.length - 1]}@${domain}`;
  }

  private maskPhone(phone: string): string {
    if (!phone) {
      return '';
    }
    if (phone.length <= 4) {
      return '****';
    }
    const visibleCount = 2;
    const maskedLength = phone.length - (visibleCount * 2);
    const firstPart = phone.slice(0, visibleCount);
    const lastPart = phone.slice(-visibleCount);
    return `${firstPart}${'*'.repeat(maskedLength > 0 ? maskedLength : 4)}${lastPart}`;
  }

  private async getRequesterInfo(req: Request) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return null;
      }
      const token = authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : authHeader;
      if (!token) {
        return null;
      }
      const decoded = await this.authnService.decodeToken(token);
      let isHRorAdmin = false;
      if (decoded && decoded.role) {
        const role = decoded.role.toLowerCase();
        isHRorAdmin = role === 'admin' || role === 'hr';
      }
      return { ...decoded, isHRorAdmin };
    } catch {
      return null;
    }
  }

  upsertProfile = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      HrProfileUpsertValidation.parse(body);

      const userId = req.headers.userId as string;
      if (!userId) {
        throw new AppError(HR_MSGS.ERR.USER_ID_REQUIRED, { apiName: 'upsertProfile' }, 400);
      }

      const profile = await this.hrService.upsertProfile(userId, body);
      return fmtRes(res, profile);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_UPSERT_PROFILE, apiName: 'upsertProfile', error }, error.statusCode || 400);
    }
  };

  getProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;
      const profile = await this.hrService.getProfileByUserId(userId);
      if (!profile) {
        throw new AppError(HR_MSGS.ERR.PROFILE_NOT_FOUND, { apiName: 'getProfile', debugValues: { userId } }, 404);
      }

      const profileObj: any = profile.toObject ? profile.toObject() : { ...profile };
      const userObj = profileObj.userId;
      profileObj.fullName = userObj?.fullName || '';
      profileObj.email = userObj?.email || '';

      if (typeof profileObj.userId === 'object' && profileObj.userId !== null) {
        profileObj.userId = profileObj.userId._id.toString();
      }

      // Record profile view to view history if viewer is logged in and not viewing themselves
      const loggedInUserId = req.headers.userId as string;
      if (loggedInUserId && loggedInUserId !== userId) {
        await ProfileViewHistory.findOneAndUpdate(
          { userId: loggedInUserId, viewedUserId: userId },
          { viewedAt: new Date() },
          { upsert: true },
        ).catch((err: any) => console.error('Failed to log view profile history:', err));
      }

      return fmtRes(res, profileObj);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_PROFILE, apiName: 'getProfile' }, error.statusCode || 400);
    }
  };

  getViewedProfiles = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError(HR_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'getViewedProfiles' }, 401);
      }

      const { page, pageSize, search, sortBy, sortOrder } = (req.query || {}) as any;
      const history = await this.historyService.getViewedProfiles(loggedInUserId, { page, pageSize, search, sortBy, sortOrder });
      return fmtRes(res, history);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_VIEWED_PROFILES, apiName: 'getViewedProfiles' }, 400);
    }
  };

  getSearches = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError(HR_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'getSearches' }, 401);
      }

      const { page, pageSize, search, sortBy, sortOrder } = (req.query || {}) as any;
      const searches = await this.historyService.getSearches(loggedInUserId, { page, pageSize, search, sortBy, sortOrder });
      return fmtRes(res, searches);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_SEARCH_HISTORY, apiName: 'getSearches' }, 400);
    }
  };

  searchCandidates = async (req: Request, res: Response) => {
    const loggedInUserId = req.headers.userId as string;
    if (!loggedInUserId) {
      throw new AppError(HR_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'searchCandidates' }, 401);
    }

    const { searchKey, minExperience, skills, isInitial } = req.query as {
      searchKey?: string;
      minExperience?: string;
      skills?: string;
      isInitial?: string;
    };
    try {
      let updatedUser: any = null;
      if (isInitial === 'true') {
        updatedUser = await this.userService.getUserByUserId(loggedInUserId);
      } else {
        // Deduct 5 coins
        updatedUser = await this.userService.deductCoins(loggedInUserId, 5);
      }

      const searchParameters: any = {
        q: searchKey || '*',
        query_by: 'skills,bio,blogKeywords',
        text_match_type: 'max_score',
        weights: '5,1,3',
      };

      const filterConditions: string[] = [];
      if (minExperience) {
        filterConditions.push(`experience:>=${Number(minExperience)}`);
      }
      if (skills) {
        const skillsList = skills.split(',').map((s: string) => s.trim());
        filterConditions.push(`skills:=[${skillsList.join(',')}]`);
      }

      if (filterConditions.length > 0) {
        searchParameters.filter_by = filterConditions.join(' && ');
      }

      let docs: any[] = [];
      try {
        const result = await sensiSearch.search(TYPSENSE_COLLECTION_NAME.CANDIDATES, searchParameters);
        docs = result?.hits?.map((hit: any) => hit.document) || [];
      } catch (typesenseError: any) {
        console.warn('Typesense candidate search unavailable or failed, falling back to MongoDB:', typesenseError?.message);
        docs = await this.hrService.searchCandidatesMongo(searchKey, minExperience, skills);
      }
      if (docs.length === 0 && (!searchKey || searchKey === '*')) {
        docs = await this.hrService.searchCandidatesMongo(searchKey, minExperience, skills);
      }

      const requester = await this.getRequesterInfo(req);

      const maskedDocs = docs.map((doc: any) => {
        const showComplete = requester && (requester.isHRorAdmin || requester.userId === doc.userId);
        if (!showComplete) {
          return {
            ...doc,
            email: this.maskEmail(doc.email),
            mobileNumber: this.maskPhone(doc.mobileNumber),
          };
        }
        return doc;
      });

      // Record search to SearchHistory
      if (searchKey) {
        await SearchHistory.findOneAndUpdate(
          { userId: loggedInUserId, query: searchKey },
          { searchedAt: new Date(), filters: { minExperience, skills } },
          { upsert: true },
        ).catch((err: any) => console.error('Failed to log search history:', err));
      }

      return fmtRes(res, {
        candidates: maskedDocs,
        remainingCoins: updatedUser?.coins || 0,
      });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_SEARCH_CANDIDATES, apiName: 'searchCandidates' }, error.statusCode || 400);
    }
  };
}
