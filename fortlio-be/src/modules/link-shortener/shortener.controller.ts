import { Request, Response } from 'express';
import { generateShortCode } from '../../core/core-utils';
import { ShortenerService } from './shortener.service';
import { fmtRes } from '../../core/core-utils/res-util';
import { AppError } from '../../core/core-utils/err-util';
import * as SHORTNER_MSGS from './shortener.constants';
import { ShortItValidation, IsKeyAvailableValidation, ShortValueValidation, ShortCodeValidation, DwellTimeValidation } from './shortener.validation';

export class ShortnerController {
  constructor(private shortenerService: ShortenerService) { }

  redirectToUrl = async (req: Request, res: Response) => {
    try {
      const { shortValue } = ShortValueValidation.parse(req.params);
      const url = await this.shortenerService.fetchUrl(shortValue);
      if (!url) {
        throw new AppError('Short URL not found', { msg: 'Short URL not found', apiName: 'redirectToUrl', debugValues: { shortValue } }, 404);
      }
      return res.redirect(url);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_REDIRECT_TO_SHORT_URL, apiName: 'redirectToUrl' }, 400);
    }
  };

  isAvailable = async (req: Request, res: Response) => {
    try {
      const { alias } = IsKeyAvailableValidation.parse(req.query);
      const data = await this.shortenerService.checkIfAvailable(alias);
      return fmtRes(res, { isAvailable: !!data });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_CHECK_SHORT_URL_AVAILABILITY, apiName: 'isAvailable', error }, error.statusCode || 400);
    }
  };

  createShortUrl = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { originalUrl, customAlias, targetType, targetId } = ShortItValidation.parse(body);
      const userId = req.headers.userId as string;

      let shortCode: string;
      if (customAlias) {
        shortCode = customAlias;
        const isAvailable = await this.shortenerService.checkIfAvailable(shortCode);
        if (!isAvailable) {
          throw new AppError('Custom alias is already taken', { msg: 'Custom alias is already taken', apiName: 'createShortUrl', debugValues: { customAlias } }, 400);
        }
      } else {
        let isAvailable = false;
        let generatedCode = '';
        while (!isAvailable) {
          const generated = generateShortCode();
          generatedCode = generated.shortCode;
          isAvailable = await this.shortenerService.checkIfAvailable(generatedCode);
        }
        shortCode = generatedCode;
      }

      const data = await this.shortenerService.createShortUrl(shortCode, originalUrl, userId, targetType, targetId);
      return fmtRes(res, { added: true, link: data, shortCode, originalUrl, targetType: targetType || 'custom' });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_CREATE_SHORT_URL, apiName: 'createShortUrl', error }, error.statusCode || 400);
    }
  };

  createShortUrlByGuest = async (req: Request, res: Response) => {
    try {
      const body = req.body;
      const { originalUrl, customAlias, targetType, targetId } = ShortItValidation.parse(body);

      let shortCode: string;
      if (customAlias) {
        shortCode = customAlias;
        const isAvailable = await this.shortenerService.checkIfAvailable(shortCode);
        if (!isAvailable) {
          throw new AppError('Custom alias is already taken', { msg: 'Custom alias is already taken', apiName: 'createShortUrlByGuest', debugValues: { customAlias } }, 400);
        }
      } else {
        let isAvailable = false;
        let generatedCode = '';
        while (!isAvailable) {
          const generated = generateShortCode();
          generatedCode = generated.shortCode;
          isAvailable = await this.shortenerService.checkIfAvailable(generatedCode);
        }
        shortCode = generatedCode;
      }

      const data = await this.shortenerService.createShortUrl(shortCode, originalUrl, null, targetType, targetId);
      return fmtRes(res, { added: true, link: data, shortCode, originalUrl, targetType: targetType || 'custom' });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_CREATE_SHORT_URL_BY_GUEST, apiName: 'createShortUrlByGuest', error }, error.statusCode || 400);
    }
  };

  recordDwellTime = async (req: Request, res: Response) => {
    try {
      const { shortCode, durationSeconds } = DwellTimeValidation.parse(req.body);
      const recorded = await this.shortenerService.recordDwellTime(shortCode, durationSeconds);
      return fmtRes(res, { recorded, shortCode, durationSeconds });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_RECORD_DWELL_TIME, apiName: 'recordDwellTime', error }, error.statusCode || 400);
    }
  };

  getLinkAnalytics = async (req: Request, res: Response) => {
    try {
      const { shortCode } = ShortCodeValidation.parse(req.params);
      const analytics = await this.shortenerService.getLinkAnalytics(shortCode);
      if (!analytics) {
        throw new AppError('Link analytics not found', { msg: 'Link analytics not found', apiName: 'getLinkAnalytics', debugValues: { shortCode } }, 404);
      }
      return fmtRes(res, analytics);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_GET_LINK_ANALYTICS, apiName: 'getLinkAnalytics', error }, error.statusCode || 400);
    }
  };

  getMyLinks = async (req: Request, res: Response) => {
    try {
      const userId = req.headers.userId as string;
      if (!userId) {
        throw new AppError('Unauthorized', { msg: 'User ID missing in headers', apiName: 'getMyLinks' }, 401);
      }
      const hasQuery = req.query && Object.keys(req.query).length > 0;
      const { page, pageSize, search, sortBy, sortOrder } = (req.query || {}) as any;
      const result = hasQuery
        ? await this.shortenerService.getMyLinks(userId, { page, pageSize, search, sortBy, sortOrder })
        : await this.shortenerService.getMyLinks(userId);
      const links = Array.isArray(result) ? result : (result?.data || []);
      const total = Array.isArray(result) ? result.length : (result?.totalCount ?? links.length);
      return fmtRes(res, {
        links,
        total,
        data: links,
        totalCount: total,
        totalPages: result?.totalPages ?? 1,
        currentPage: result?.currentPage ?? 1,
        hasPrev: result?.hasPrev ?? false,
        hasNext: result?.hasNext ?? false,
      });
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: SHORTNER_MSGS.ERR.FAILED_TO_FETCH_MY_LINKS, apiName: 'getMyLinks', error }, error.statusCode || 400);
    }
  };
}
