import { Request, Response } from 'express';
import { JobService } from './job.service';
import { JobCreateValidation, JobStatusUpdateValidation, JobApplyValidation } from './job.validation';
import { fmtRes } from '../../core/core-utils/res-util';
import { AppError } from '../../core/core-utils/err-util';
import { JOB_MSGS } from './job.constants';

export class JobController {
  constructor(private jobService: JobService) {}

  createJob = async (req: Request, res: Response) => {
    try {
      const hrUserId = req.headers.userId as string;
      if (!hrUserId) {
        throw new AppError(JOB_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'createJob' }, 401);
      }

      const body = JobCreateValidation.parse(req.body);
      const job = await this.jobService.createJob(hrUserId, body);
      return fmtRes(res, job);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_CREATE_JOB,
        apiName: 'createJob',
        error,
      }, error.statusCode || 400);
    }
  };

  getMyJobs = async (req: Request, res: Response) => {
    try {
      const hrUserId = req.headers.userId as string;
      if (!hrUserId) {
        throw new AppError(JOB_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'getMyJobs' }, 401);
      }

      const jobs = await this.jobService.getMyJobs(hrUserId);
      return fmtRes(res, jobs);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_JOBS,
        apiName: 'getMyJobs',
        error,
      }, error.statusCode || 400);
    }
  };

  updateJobStatus = async (req: Request, res: Response) => {
    try {
      const hrUserId = req.headers.userId as string;
      const { jobId } = req.params;
      if (!hrUserId) {
        throw new AppError(JOB_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'updateJobStatus' }, 401);
      }

      const { status } = JobStatusUpdateValidation.parse(req.body);
      const updatedJob = await this.jobService.updateJobStatus(hrUserId, jobId, status);
      return fmtRes(res, updatedJob);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_UPDATE_JOB,
        apiName: 'updateJobStatus',
        error,
      }, error.statusCode || 400);
    }
  };

  searchJobs = async (req: Request, res: Response) => {
    try {
      const { searchKey, profession, workplaceType, minExperience, skills } = req.query as {
        searchKey?: string;
        profession?: string;
        workplaceType?: 'Remote' | 'Hybrid' | 'Onsite';
        minExperience?: string;
        skills?: string;
      };

      const skillsList = skills ? skills.split(',').map((s) => s.trim()).filter(Boolean) : undefined;
      const minExp = minExperience ? Number(minExperience) : undefined;

      const jobs = await this.jobService.searchJobs({
        searchKey,
        profession,
        workplaceType,
        minExperience: minExp,
        skills: skillsList,
      });

      return fmtRes(res, jobs);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_JOBS,
        apiName: 'searchJobs',
        error,
      }, error.statusCode || 400);
    }
  };

  getSuggestions = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      if (!candidateUserId) {
        throw new AppError(JOB_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'getSuggestions' }, 401);
      }

      const suggestions = await this.jobService.getSuggestions(candidateUserId);
      return fmtRes(res, suggestions);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_JOBS,
        apiName: 'getSuggestions',
        error,
      }, error.statusCode || 400);
    }
  };

  applyJob = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      const { jobId } = req.params;
      if (!candidateUserId) {
        throw new AppError(JOB_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'applyJob' }, 401);
      }

      const { coverNote } = JobApplyValidation.parse(req.body);
      const application = await this.jobService.applyJob(candidateUserId, jobId, coverNote);
      return fmtRes(res, application);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_APPLY_JOB,
        apiName: 'applyJob',
        error,
      }, error.statusCode || 400);
    }
  };

  getJobApplicants = async (req: Request, res: Response) => {
    try {
      const hrUserId = req.headers.userId as string;
      const { jobId } = req.params;
      if (!hrUserId) {
        throw new AppError(JOB_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'getJobApplicants' }, 401);
      }

      const applicants = await this.jobService.getJobApplicants(hrUserId, jobId);
      return fmtRes(res, applicants);
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(error.message || 'unknown', {
        msg: JOB_MSGS.ERR.FAILED_TO_FETCH_APPLICANTS,
        apiName: 'getJobApplicants',
        error,
      }, error.statusCode || 400);
    }
  };
}
