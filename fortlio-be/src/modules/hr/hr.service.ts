import mongoose from 'mongoose';
import HrProfile from './models/hr.model';
import User from '../user/models/user.model';
import CandidateProfile from '../candidate/models/candidate.model';
import { IHrCreate } from './hr.interface';
import { AppError } from '../../core/core-utils/err-util';
import * as HR_MSGS from './hr.constants';
import { searchCandidatesMongoPipeline } from './hr.queries';

export class HrService {
  async upsertProfile(userId: string, data: IHrCreate) {
    try {
      const userObjectId = new mongoose.Types.ObjectId(userId);

      // Update basic details in User collection
      await User.findByIdAndUpdate(userObjectId, {
        fullName: data.fullName,
        email: data.email,
      });

      // Update dedicated details in HR Profile collection
      const profile = await HrProfile.findOneAndUpdate(
        { userId: userObjectId },
        {
          userId: userObjectId,
          mobileNumber: data.mobileNumber || '',
          companyName: data.companyName || '',
          companyWebsite: data.companyWebsite || '',
          designation: data.designation || '',
        },
        { new: true, upsert: true },
      );

      return profile;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_UPSERT_PROFILE, apiName: 'upsertProfile', debugValues: { userId } });
    }
  }

  async getProfileByUserId(userId: string) {
    try {
      return await HrProfile.findOne({ userId: new mongoose.Types.ObjectId(userId) }).populate('userId').exec();
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: HR_MSGS.ERR.FAILED_TO_FETCH_PROFILE, apiName: 'getProfileByUserId', debugValues: { userId } });
    }
  }

  async searchCandidatesMongo(searchKey?: string, minExperience?: string | number, skills?: string) {
    try {
      const skillsArray = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
      const minExpNum = minExperience ? Number(minExperience) : undefined;
      const pipeline = searchCandidatesMongoPipeline(searchKey, minExpNum, skillsArray);
      return await CandidateProfile.aggregate(pipeline).exec();
    } catch (error: any) {
      console.error('Error in searchCandidatesMongo aggregation:', error);
      return [];
    }
  }
}
