import mongoose from 'mongoose';
import { ReadPreference } from 'mongodb';
import Job from './models/job.model';
import JobApplication from './models/job-application.model';
import CandidateProfile from '../candidate/models/candidate.model';
import { IJobCreate, IJobFilter } from './job.interface';
import { IFilter } from '../../interface/common.interface';
import { getMyJobsBasePipeline, getSearchJobsBasePipeline, jobDetailsLookupPipeline, getJobApplicantsBasePipeline, jobApplicantsLookupPipeline } from './job.queries';
import { getDataWithLookupsAfterFilter } from '../../core/core-helper/mongo.helper';
import { AppError } from '../../core/core-utils/err-util';
import { JOB_MSGS } from './job.constants';

export class JobService {
  async createJob(hrUserId: string, data: IJobCreate) {
    try {
      const job = await Job.create({
        ...data,
        postedBy: new mongoose.Types.ObjectId(hrUserId),
        status: 'active',
      });
      return job;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_CREATE_JOB,
        apiName: 'createJob',
        error,
      });
    }
  }

  async getMyJobs(hrUserId: string, filterQuery: IFilter = {}) {
    try {
      const basePipeline = getMyJobsBasePipeline(hrUserId);
      const searchFields = ['title', 'companyName', 'department', 'profession', 'location', 'skills'];
      return await getDataWithLookupsAfterFilter(
        filterQuery,
        basePipeline,
        jobDetailsLookupPipeline,
        searchFields,
        Job,
        ReadPreference.primary,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_JOBS,
        apiName: 'getMyJobs',
        debugValues: { hrUserId },
      });
    }
  }

  async updateJobStatus(hrUserId: string, jobId: string, status: 'active' | 'closed' | 'draft') {
    try {
      const job = await Job.findOne({
        _id: new mongoose.Types.ObjectId(jobId),
        postedBy: new mongoose.Types.ObjectId(hrUserId),
      });

      if (!job) {
        throw new AppError(JOB_MSGS.ERR.JOB_NOT_FOUND, { apiName: 'updateJobStatus', debugValues: { jobId } }, 404);
      }

      job.status = status;
      await job.save();
      return job;
    } catch (error: any) {
      if (error instanceof AppError) {throw error;}
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_UPDATE_JOB,
        apiName: 'updateJobStatus',
        error,
      });
    }
  }

  async searchJobs(filter: IJobFilter) {
    try {
      const basePipeline = getSearchJobsBasePipeline(filter);
      const searchFields = ['title', 'companyName', 'department', 'profession', 'location', 'skills', 'description'];
      const filterQuery: IFilter = {
        search: filter.search || filter.searchKey || '',
        page: filter.page,
        pageSize: filter.pageSize,
        sortBy: filter.sortBy || 'createdAt',
        sortOrder: filter.sortOrder || 'desc',
      };
      return await getDataWithLookupsAfterFilter(
        filterQuery,
        basePipeline,
        jobDetailsLookupPipeline,
        searchFields,
        Job,
        ReadPreference.primary,
      );
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_JOBS,
        apiName: 'searchJobs',
        error,
      });
    }
  }

  async getSuggestions(candidateUserId: string) {
    try {
      const candidateProfile = await CandidateProfile.findOne({
        userId: new mongoose.Types.ObjectId(candidateUserId),
      }).lean();

      const candidateSkills = (candidateProfile?.skills || []).map((s) => s.toLowerCase());
      const candidateExp = candidateProfile?.experience || 0;

      const jobsResult = await this.searchJobs({ pageSize: '50' });
      const jobs = jobsResult?.data || [];

      // Compute match score based on candidate skills overlap and experience
      return jobs.map((job: any) => {
        const jobSkills = (job.skills || []).map((s: string) => s.toLowerCase());
        const matchedSkills = jobSkills.filter((s: string) => candidateSkills.includes(s));
        const skillScore = jobSkills.length > 0 ? (matchedSkills.length / jobSkills.length) * 70 : 50;
        const expScore = candidateExp >= (job.experienceYears || 0) ? 30 : Math.max(10, 30 - ((job.experienceYears || 0) - candidateExp) * 5);
        const matchScore = Math.min(99, Math.round(skillScore + expScore));

        return {
          ...job,
          matchScore,
        };
      }).sort((a: any, b: any) => b.matchScore - a.matchScore);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_JOBS,
        apiName: 'getSuggestions',
        error,
      });
    }
  }

  async applyJob(candidateUserId: string, jobId: string, coverNote?: string) {
    try {
      const job = await Job.findById(jobId);
      if (!job) {
        throw new AppError(JOB_MSGS.ERR.JOB_NOT_FOUND, { apiName: 'applyJob', debugValues: { jobId } }, 404);
      }

      const existing = await JobApplication.findOne({
        jobId: new mongoose.Types.ObjectId(jobId),
        candidateId: new mongoose.Types.ObjectId(candidateUserId),
      });

      if (existing) {
        throw new AppError(JOB_MSGS.ERR.ALREADY_APPLIED, { apiName: 'applyJob', debugValues: { jobId } }, 409);
      }

      const application = await JobApplication.create({
        jobId: new mongoose.Types.ObjectId(jobId),
        candidateId: new mongoose.Types.ObjectId(candidateUserId),
        coverNote: coverNote || '',
        status: 'applied',
        appliedAt: new Date(),
      });

      return application;
    } catch (error: any) {
      if (error instanceof AppError) {throw error;}
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_APPLY_JOB,
        apiName: 'applyJob',
        error,
      });
    }
  }

  async getJobApplicants(hrUserId: string, jobId: string, filterQuery: IFilter = {}) {
    try {
      const job = await Job.findOne({
        _id: new mongoose.Types.ObjectId(jobId),
        postedBy: new mongoose.Types.ObjectId(hrUserId),
      });

      if (!job) {
        throw new AppError(JOB_MSGS.ERR.JOB_NOT_FOUND, { apiName: 'getJobApplicants', debugValues: { jobId } }, 404);
      }

      const basePipeline = getJobApplicantsBasePipeline(jobId);
      const searchFields = ['status', 'coverNote'];
      return await getDataWithLookupsAfterFilter(
        { ...filterQuery, sortBy: filterQuery.sortBy || 'appliedAt' },
        basePipeline,
        jobApplicantsLookupPipeline,
        searchFields,
        JobApplication,
        ReadPreference.primary,
      );
    } catch (error: any) {
      if (error instanceof AppError) {throw error;}
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_APPLICANTS,
        apiName: 'getJobApplicants',
        error,
      });
    }
  }
}
