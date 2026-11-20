import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { AppError } from '../src/core/core-utils/err-util';
import { AuthnController } from '../src/modules/auth/auth.controller';
import * as AUTHN_MSGS from '../src/modules/auth/auth.constants';
import { Request, Response } from 'express';

describe('AuthnController Unit Tests', () => {
  let authController: AuthnController;
  let mockAuthnService: any;
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
    return res as unknown as Response;
  };

  const VALID_USER_ID = '123456789012345678901234';
  const VALID_EMAIL = 'candidate@test.com';
  const VALID_PASSWORD = 'Password123!';
  const VALID_NAME = 'Jane Candidate';
  const VALID_TOKEN = 'mock-valid-token-123';

  beforeEach(() => {
    mockAuthnService = {
      register: mock(() => Promise.resolve({})),
      login: mock(() => Promise.resolve({})),
      verifyEmail: mock(() => Promise.resolve({})),
      resendVerification: mock(() => Promise.resolve({})),
      refreshToken: mock(() => Promise.resolve({})),
      logout: mock(() => Promise.resolve({})),
    };

    authController = new AuthnController(mockAuthnService);
    mockRes = mockResponse();
  });

  describe('register', () => {
    it('should successfully register a user and return response', async () => {
      const payload = {
        email: VALID_EMAIL,
        password: VALID_PASSWORD,
        fullName: VALID_NAME,
      };
      const req = { body: payload } as unknown as Request;

      const mockResult = {
        user: { _id: VALID_USER_ID, email: VALID_EMAIL, fullName: VALID_NAME },
        message: 'Registration successful',
      };
      mockAuthnService.register.mockResolvedValue(mockResult);

      await authController.register(req, mockRes);

      expect(mockAuthnService.register).toHaveBeenCalledWith(payload);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({ success: true, data: mockResult });
    });

    it('should throw AppError when authnService.register fails', async () => {
      const req = { body: { email: VALID_EMAIL } } as unknown as Request;
      mockAuthnService.register.mockRejectedValue(new Error('User already exists'));

      expect(authController.register(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('login', () => {
    it('should successfully login user and return tokens and user metadata', async () => {
      const credentials = { email: VALID_EMAIL, password: VALID_PASSWORD };
      const req = { body: credentials } as unknown as Request;

      const mockResult = {
        accessToken: 'access-token-xyz',
        refreshToken: 'refresh-token-abc',
        user: { _id: VALID_USER_ID, email: VALID_EMAIL },
      };
      mockAuthnService.login.mockResolvedValue(mockResult);

      await authController.login(req, mockRes);

      expect(mockAuthnService.login).toHaveBeenCalledWith(credentials);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({ success: true, data: mockResult });
    });

    it('should throw AppError when authnService.login fails with invalid credentials', async () => {
      const req = {
        body: { email: VALID_EMAIL, password: 'wrongpassword' },
      } as unknown as Request;
      mockAuthnService.login.mockRejectedValue(new Error('Invalid credentials'));

      expect(authController.login(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('verifyEmail', () => {
    it('should successfully verify email when given a valid token query', async () => {
      const req = {
        query: { token: VALID_TOKEN },
      } as unknown as Request;

      const mockResult = { message: 'Email verified successfully' };
      mockAuthnService.verifyEmail.mockResolvedValue(mockResult);

      await authController.verifyEmail(req, mockRes);

      expect(mockAuthnService.verifyEmail).toHaveBeenCalledWith(VALID_TOKEN);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({ success: true, data: mockResult });
    });

    it('should throw AppError when token verification fails or is expired', async () => {
      const req = {
        query: { token: 'invalid-or-expired-token' },
      } as unknown as Request;
      mockAuthnService.verifyEmail.mockRejectedValue(new Error('Verification token expired'));

      expect(authController.verifyEmail(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('resendVerification', () => {
    it('should successfully resend verification email', async () => {
      const req = {
        body: { email: VALID_EMAIL },
      } as unknown as Request;

      const mockResult = { message: AUTHN_MSGS.RES.OTP_SENT_SUCCESSFULLY };
      mockAuthnService.resendVerification.mockResolvedValue(mockResult);

      await authController.resendVerification(req, mockRes);

      expect(mockAuthnService.resendVerification).toHaveBeenCalledWith(VALID_EMAIL);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({ success: true, data: mockResult });
    });

    it('should throw AppError if resending verification fails', async () => {
      const req = {
        body: { email: 'nonexistent@test.com' },
      } as unknown as Request;
      mockAuthnService.resendVerification.mockRejectedValue(new Error('User not found'));

      expect(authController.resendVerification(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('refreshToken', () => {
    it('should successfully refresh access token with Bearer header', async () => {
      const req = {
        headers: { authorization: `Bearer ${VALID_TOKEN}` },
      } as unknown as Request;

      const mockResult = { accessToken: 'new-access-token' };
      mockAuthnService.refreshToken.mockResolvedValue(mockResult);

      await authController.refreshToken(req, mockRes);

      expect(mockAuthnService.refreshToken).toHaveBeenCalledWith(VALID_TOKEN);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({ success: true, data: mockResult });
    });

    it('should throw AppError when authorization header is missing', async () => {
      const req = {
        headers: {},
      } as unknown as Request;

      expect(authController.refreshToken(req, mockRes)).rejects.toThrow(AppError);
    });

    it('should throw AppError when token is malformed in authorization header', async () => {
      const req = {
        headers: { authorization: 'Bearer' },
      } as unknown as Request;

      expect(authController.refreshToken(req, mockRes)).rejects.toThrow(AppError);
    });

    it('should throw AppError when service rejects refresh token', async () => {
      const req = {
        headers: { authorization: `Bearer ${VALID_TOKEN}` },
      } as unknown as Request;
      mockAuthnService.refreshToken.mockRejectedValue(new Error('Invalid refresh token'));

      expect(authController.refreshToken(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('logout', () => {
    it('should successfully logout user when userId is provided in query', async () => {
      const req = {
        query: { userId: VALID_USER_ID },
      } as unknown as Request;

      mockAuthnService.logout.mockResolvedValue(true);

      await authController.logout(req, mockRes);

      expect(mockAuthnService.logout).toHaveBeenCalledWith(VALID_USER_ID);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: { message: AUTHN_MSGS.RES.LOGOUT_SUCCESS },
      });
    });

    it('should throw AppError when userId is missing from query', async () => {
      const req = {
        query: {},
      } as unknown as Request;

      expect(authController.logout(req, mockRes)).rejects.toThrow(AppError);
    });

    it('should throw AppError when service.logout rejects', async () => {
      const req = {
        query: { userId: VALID_USER_ID },
      } as unknown as Request;
      mockAuthnService.logout.mockRejectedValue(new Error('Redis error'));

      expect(authController.logout(req, mockRes)).rejects.toThrow(AppError);
    });
  });
});
