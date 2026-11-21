import crypto from 'crypto';
import { Request, Response } from 'express';
import { FortiService } from './forti.service';
import { fmtRes } from '../../core/core-utils/res-util';
import { AppError } from '../../core/core-utils/err-util';
import * as FORTI_MSGS from './forti.constants';
import {
  GetInsightsValidation,
  GenerateInsightsValidation,
  CandidateChatParamsValidation,
  CandidateChatQueryValidation,
} from './forti.validation';

export class FortiController {
  constructor(private fortiService: FortiService) {}

  getInsights = async (req: Request, res: Response) => {
    try {
      const { candidateId } = GetInsightsValidation.parse(req.params);
      const insights = await this.fortiService.getInsights(candidateId);
      if (!insights) {
        throw new AppError('Insights not found', {
          msg: FORTI_MSGS.ERR.INSIGHTS_NOT_FOUND,
          apiName: 'getInsights',
          debugValues: { candidateId },
        }, 404);
      }
      return fmtRes(res, insights);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: FORTI_MSGS.ERR.FAILED_TO_GET_INSIGHTS,
        apiName: 'getInsights',
        error,
      }, error.statusCode || 400);
    }
  };

  synthesizeInsights = async (req: Request, res: Response) => {
    try {
      const { candidateId } = GenerateInsightsValidation.parse(req.params);
      const insights = await this.fortiService.synthesizeInsights(candidateId);
      return fmtRes(res, insights);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', {
        msg: FORTI_MSGS.ERR.FAILED_TO_SYNTHESIZE_INSIGHTS,
        apiName: 'synthesizeInsights',
        error,
      }, error.statusCode || 400);
    }
  };

  chatWithCandidateProfile = async (req: Request, res: Response) => {
    try {
      const { userId } = CandidateChatParamsValidation.parse(req.params);
      const { question } = CandidateChatQueryValidation.parse(req.query);

      res.setHeader('Content-Type', 'text/event-stream');
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      if (res.flushHeaders) res.flushHeaders();

      await this.fortiService.chatWithCandidateProfile(userId, question, (chunk) => {
        res.write(`data: ${JSON.stringify({ t: chunk })}\n\n`);
      });

      res.write(`data: ${JSON.stringify({ d: true })}\n\n`);
      res.end();
    } catch (error: any) {
      if (res.headersSent) {
        res.write(`data: ${JSON.stringify({ error: error.message || 'Chat stream failed' })}\n\n`);
        res.write(`data: ${JSON.stringify({ d: true })}\n\n`);
        res.end();
        return;
      }
      throw new AppError(error.message || 'unknown', {
        msg: FORTI_MSGS.ERR.FAILED_TO_STREAM_CHAT,
        apiName: 'chatWithCandidateProfile',
        error,
      }, error.statusCode || 400);
    }
  };

  getSession = async (_req: Request, res: Response) => {
    try {
      const sessionId = crypto.randomBytes(32).toString('hex');
      res.cookie('sessionId', sessionId, {
        httpOnly: true,
        secure: true,
        sameSite: 'lax',
        maxAge: 2 * 60 * 60 * 1000,
      });
      return fmtRes(res, { sessionId });
    } catch (error: any) {
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
