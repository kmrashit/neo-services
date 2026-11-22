import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { AppError } from '../src/core/core-utils/err-util';
import { ShortnerController } from '../src/modules/link-shortener/shortener.controller';
import { Request, Response } from 'express';

describe('ShortnerController Unit Tests', () => {
  let shortnerController: ShortnerController;
  let mockShortenerService: any;
  let mockRes: any;

  const mockResponse = () => {
    const res: any = {};
    res.status = mock((code: number) => {
      res.statusCode = code;
      return res;
    });
    res.send = mock((body: any) => {
      res.body = body;
      return res;
    });
    res.json = mock((body: any) => {
      res.body = body;
      return res;
    });
    res.redirect = mock((url: string) => {
      res.redirectUrl = url;
      return res;
    });
    return res as unknown as Response;
  };

  const VALID_USER_ID = '123456789012345678901234';
  const ORIGINAL_URL = 'https://example.com/candidate/profile/123456789012345678901234';

  beforeEach(() => {
    mockShortenerService = {
      fetchUrl: mock(() => Promise.resolve(ORIGINAL_URL)),
      checkIfAvailable: mock(() => Promise.resolve(true)),
      createShortUrl: mock(() => Promise.resolve(true)),
    };

    shortnerController = new ShortnerController(mockShortenerService);
    mockRes = mockResponse();
  });

  describe('redirectToUrl', () => {
    it('should successfully redirect to the original URL if code exists', async () => {
      const req = {
        params: { shortValue: 'abc-def-ghi' },
      } as unknown as Request;

      await shortnerController.redirectToUrl(req, mockRes);

      expect(mockShortenerService.fetchUrl).toHaveBeenCalledWith('abc-def-ghi');
      expect(mockRes.redirectUrl).toBe(ORIGINAL_URL);
    });

    it('should throw AppError with 404 if the short code is not found', async () => {
      mockShortenerService.fetchUrl.mockResolvedValue('');

      const req = {
        params: { shortValue: 'non-existent' },
      } as unknown as Request;

      expect(shortnerController.redirectToUrl(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('isAvailable', () => {
    it('should return isAvailable: true if custom alias is free', async () => {
      const req = {
        query: { alias: 'my-alias' },
      } as unknown as Request;

      await shortnerController.isAvailable(req, mockRes);

      expect(mockShortenerService.checkIfAvailable).toHaveBeenCalledWith('my-alias');
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.isAvailable).toBe(true);
    });
  });

  describe('createShortUrl', () => {
    it('should successfully create short URL with custom alias if available', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: { originalUrl: ORIGINAL_URL, customAlias: 'my-alias' },
      } as unknown as Request;

      await shortnerController.createShortUrl(req, mockRes);

      expect(mockShortenerService.checkIfAvailable).toHaveBeenCalledWith('my-alias');
      expect(mockShortenerService.createShortUrl).toHaveBeenCalledWith('my-alias', ORIGINAL_URL, VALID_USER_ID, undefined, undefined);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.shortCode).toBe('my-alias');
    });

    it('should throw error if custom alias is already taken', async () => {
      mockShortenerService.checkIfAvailable.mockResolvedValue(false);

      const req = {
        headers: { userId: VALID_USER_ID },
        body: { originalUrl: ORIGINAL_URL, customAlias: 'taken-alias' },
      } as unknown as Request;

      expect(shortnerController.createShortUrl(req, mockRes)).rejects.toThrow(AppError);
    });

    it('should generate a unique random short code if custom alias is not provided', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: { originalUrl: ORIGINAL_URL },
      } as unknown as Request;

      await shortnerController.createShortUrl(req, mockRes);

      expect(mockShortenerService.createShortUrl).toHaveBeenCalled();
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.shortCode).toBeDefined();
    });
  });

  describe('createShortUrlByGuest', () => {
    it('should successfully create short URL for guest with null createdBy', async () => {
      const req = {
        body: { originalUrl: ORIGINAL_URL },
      } as unknown as Request;

      await shortnerController.createShortUrlByGuest(req, mockRes);

      expect(mockShortenerService.createShortUrl).toHaveBeenCalledWith(expect.any(String), ORIGINAL_URL, null, undefined, undefined);
      expect(mockRes.body.success).toBe(true);
    });
  });

  describe('recordDwellTime', () => {
    it('should successfully record visitor dwell time', async () => {
      mockShortenerService.recordDwellTime = mock(() => Promise.resolve(true));

      const req = {
        body: { shortCode: 'res-alex123', durationSeconds: 45 },
      } as unknown as Request;

      await shortnerController.recordDwellTime(req, mockRes);

      expect(mockShortenerService.recordDwellTime).toHaveBeenCalledWith('res-alex123', 45);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.recorded).toBe(true);
    });

    it('should throw AppError if durationSeconds is invalid', async () => {
      const req = {
        body: { shortCode: 'res-alex123', durationSeconds: -5 },
      } as unknown as Request;

      expect(shortnerController.recordDwellTime(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('getLinkAnalytics', () => {
    it('should return link analytics data if code exists', async () => {
      const mockAnalytics = {
        shortCode: 'res-alex123',
        viewsCount: 15,
        totalTimeSpentSeconds: 600,
        averageTimeSpentSeconds: 40,
        targetType: 'resume',
      };
      mockShortenerService.getLinkAnalytics = mock(() => Promise.resolve(mockAnalytics));

      const req = {
        params: { shortCode: 'res-alex123' },
      } as unknown as Request;

      await shortnerController.getLinkAnalytics(req, mockRes);

      expect(mockShortenerService.getLinkAnalytics).toHaveBeenCalledWith('res-alex123');
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.viewsCount).toBe(15);
      expect(mockRes.body.data.averageTimeSpentSeconds).toBe(40);
    });

    it('should throw 404 AppError if analytics are not found', async () => {
      mockShortenerService.getLinkAnalytics = mock(() => Promise.resolve(null));

      const req = {
        params: { shortCode: 'not-found' },
      } as unknown as Request;

      expect(shortnerController.getLinkAnalytics(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('getMyLinks', () => {
    it('should successfully fetch candidate links list', async () => {
      const mockLinks = [
        { shortCode: 'link1', viewsCount: 10, totalTimeSpentSeconds: 300 },
        { shortCode: 'link2', viewsCount: 5, totalTimeSpentSeconds: 120 },
      ];
      mockShortenerService.getMyLinks = mock(() => Promise.resolve(mockLinks));

      const req = {
        headers: { userId: VALID_USER_ID },
      } as unknown as Request;

      await shortnerController.getMyLinks(req, mockRes);

      expect(mockShortenerService.getMyLinks).toHaveBeenCalledWith(VALID_USER_ID);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.total).toBe(2);
      expect(mockRes.body.data.links).toHaveLength(2);
    });

    it('should throw 401 AppError if userId header is missing', async () => {
      const req = {
        headers: {},
      } as unknown as Request;

      expect(shortnerController.getMyLinks(req, mockRes)).rejects.toThrow(AppError);
    });
  });
});
