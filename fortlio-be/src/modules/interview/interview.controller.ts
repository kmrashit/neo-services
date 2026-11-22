import { Request, Response } from 'express';
import { InterviewService } from './interview.service';
import { StartInterviewValidation, SubmitResponseValidation, InterviewIdParamValidation, ToggleVisibilityValidation } from './interview.validation';
import { fmtRes } from '../../core/core-utils/res-util';
import { AppError } from '../../core/core-utils/err-util';
import { INTERVIEW_MSGS } from './interview.constants';

export class InterviewController {
  constructor(private interviewService: InterviewService) {}

  startSession = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      if (!candidateUserId) {
        throw new AppError(INTERVIEW_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'startSession' }, 401);
      }

      const body = StartInterviewValidation.parse(req.body);
      const session = await this.interviewService.startSession(candidateUserId, body);
      return fmtRes(res, session);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: INTERVIEW_MSGS.ERR.FAILED_TO_START,
        apiName: 'startSession',
      }, error.statusCode || 400);
    }
  };

  submitResponse = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      if (!candidateUserId) {
        throw new AppError(INTERVIEW_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'submitResponse' }, 401);
      }

      const { id } = InterviewIdParamValidation.parse(req.params);
      const body = SubmitResponseValidation.parse(req.body);

      const result = await this.interviewService.submitResponse(candidateUserId, id, body);
      return fmtRes(res, result);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: INTERVIEW_MSGS.ERR.FAILED_TO_RESPOND,
        apiName: 'submitResponse',
      }, error.statusCode || 400);
    }
  };

  concludeSession = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      if (!candidateUserId) {
        throw new AppError(INTERVIEW_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'concludeSession' }, 401);
      }

      const { id } = InterviewIdParamValidation.parse(req.params);
      const session = await this.interviewService.concludeSession(candidateUserId, id);
      return fmtRes(res, session);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: INTERVIEW_MSGS.ERR.FAILED_TO_CONCLUDE,
        apiName: 'concludeSession',
      }, error.statusCode || 400);
    }
  };

  getReport = async (req: Request, res: Response) => {
    try {
      const requestingUserId = req.headers.userId as string | undefined;
      const { id } = InterviewIdParamValidation.parse(req.params);

      const report = await this.interviewService.getReport(id, requestingUserId);
      return fmtRes(res, report);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: INTERVIEW_MSGS.ERR.FAILED_TO_FETCH_REPORT,
        apiName: 'getReport',
      }, error.statusCode || 400);
    }
  };

  listMyInterviews = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      if (!candidateUserId) {
        throw new AppError(INTERVIEW_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'listMyInterviews' }, 401);
      }

      const { page, pageSize, search, sortBy, sortOrder } = (req.query || {}) as any;
      const list = await this.interviewService.listMyInterviews(candidateUserId, {
        page,
        pageSize,
        search,
        sortBy,
        sortOrder,
      });
      return fmtRes(res, list);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: INTERVIEW_MSGS.ERR.FAILED_TO_LIST_INTERVIEWS,
        apiName: 'listMyInterviews',
      }, error.statusCode || 400);
    }
  };

  toggleVisibility = async (req: Request, res: Response) => {
    try {
      const candidateUserId = req.headers.userId as string;
      if (!candidateUserId) {
        throw new AppError(INTERVIEW_MSGS.ERR.UNAUTHORIZED_ACCESS, { apiName: 'toggleVisibility' }, 401);
      }

      const { id } = InterviewIdParamValidation.parse(req.params);
      const { isPublic } = ToggleVisibilityValidation.parse(req.body);

      const updated = await this.interviewService.togglePublicReport(candidateUserId, id, isPublic);
      return fmtRes(res, updated);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: 'Failed to update visibility',
        apiName: 'toggleVisibility',
      }, error.statusCode || 400);
    }
  };
}
