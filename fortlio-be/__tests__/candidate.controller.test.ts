import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { AppError } from '../src/core/core-utils/err-util';
import { CandidateController } from '../src/modules/candidate/candidate.controller';
import { Request, Response } from 'express';
import User from '../src/modules/user/models/user.model';
import SearchHistory from '../src/modules/hr/models/search-history.model';
import ProfileViewHistory from '../src/modules/hr/models/profile-view.model';
import { sensiSearch } from '../src/clients';

describe('CandidateController Unit Tests', () => {
  let candidateController: CandidateController;
  let mockCandidateService: any;
  let mockAuthnService: any;
  let mockUserService: any;
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
  const VALID_CANDIDATE_ID = '678901234567890123456789';
  const VALID_EMAIL = 'candidate@example.com';
  const VALID_PHONE = '123456789012';

  beforeEach(() => {
    mockCandidateService = {
      upsertProfile: mock(() => Promise.resolve({
        _id: VALID_CANDIDATE_ID,
        userId: VALID_USER_ID,
        fullName: 'Test Candidate',
        email: VALID_EMAIL,
        mobileNumber: VALID_PHONE,
        skills: ['TypeScript', 'Node.js'],
        githubUrl: 'https://github.com/candidate',
        linkedinUrl: 'https://linkedin.com/in/candidate',
        experience: 3,
        bio: 'Hello world',
        toObject: () => ({
          _id: VALID_CANDIDATE_ID,
          userId: VALID_USER_ID,
          fullName: 'Test Candidate',
          email: VALID_EMAIL,
          mobileNumber: VALID_PHONE,
          skills: ['TypeScript', 'Node.js'],
          githubUrl: 'https://github.com/candidate',
          linkedinUrl: 'https://linkedin.com/in/candidate',
          experience: 3,
          bio: 'Hello world',
        }),
      })),
      getProfileByUserId: mock(() => Promise.resolve({
        _id: VALID_CANDIDATE_ID,
        userId: VALID_USER_ID,
        fullName: 'Test Candidate',
        email: VALID_EMAIL,
        mobileNumber: VALID_PHONE,
        skills: ['TypeScript', 'Node.js'],
        githubUrl: 'https://github.com/candidate',
        linkedinUrl: 'https://linkedin.com/in/candidate',
        experience: 3,
        bio: 'Hello world',
        toObject: () => ({
          _id: VALID_CANDIDATE_ID,
          userId: VALID_USER_ID,
          fullName: 'Test Candidate',
          email: VALID_EMAIL,
          mobileNumber: VALID_PHONE,
          skills: ['TypeScript', 'Node.js'],
          githubUrl: 'https://github.com/candidate',
          linkedinUrl: 'https://linkedin.com/in/candidate',
          experience: 3,
          bio: 'Hello world',
        }),
      })),
      createBlog: mock(() => Promise.resolve({
        _id: 'blog12345678901234567890',
        candidateId: VALID_USER_ID,
        title: 'My First Blog',
        content: 'This is a test blog post',
        blogKeywords: ['test'],
        status: 'published',
      })),
      listBlogs: mock(() => Promise.resolve({
        data: [],
        totalCount: 0,
      })),
      parseResumeOcr: mock(() => Promise.resolve({
        fullName: 'Test Candidate',
        email: VALID_EMAIL,
        skills: ['TypeScript', 'Node.js'],
        experience: 3,
        authenticInputNote: 'OCR extraction completed. Original resume input preserved for authentic verification.',
      })),
      improveBlogWithAi: mock(() => Promise.resolve({
        title: 'Improved Title',
        content: 'Improved content with deep insights',
        suggestions: ['Quantify outcomes'],
        aspect: 'clarity',
        authenticInputNote: 'Forti AI evaluates your learning velocity and domain depth strictly based on your authentic inputs and critical thinking.',
      })),
    };

    mockAuthnService = {
      verifyToken: mock(() => Promise.resolve({
        userId: VALID_USER_ID,
        name: 'Requester Name',
        email: 'requester@example.com',
        role: 'Candidate',
      })),
    };

    mockUserService = {
      addCoins: mock(() => Promise.resolve({ _id: VALID_USER_ID, coins: 100 })),
      deductCoins: mock(() => Promise.resolve({ _id: VALID_USER_ID, coins: 95 })),
    };

    candidateController = new CandidateController(
      mockCandidateService,
      mockAuthnService,
      mockUserService,
    );
    mockRes = mockResponse();

    const _sh = SearchHistory;
    const _pvh = ProfileViewHistory;
    _sh.findOneAndUpdate = mock(() => Promise.resolve({})) as any;
    _pvh.findOneAndUpdate = mock(() => Promise.resolve({})) as any;

    // Reset User findById mock
    User.findById = mock(() => ({
      populate: mock(() => ({
        lean: mock(() => Promise.resolve(null)),
      })),
    }) as any);
    User.aggregate = mock(() => Promise.resolve([])) as any;

    // Reset Typesense search mock
    (sensiSearch.search as any) = mock(() => Promise.resolve({
      hits: [
        {
          document: {
            id: VALID_CANDIDATE_ID,
            userId: 'different-user-id',
            fullName: 'Test Candidate',
            email: VALID_EMAIL,
            mobileNumber: VALID_PHONE,
            skills: ['TypeScript'],
            experience: 3,
            bio: 'Typesense result bio',
          },
        },
      ],
    }) as any);
  });

  describe('upsertProfile', () => {
    it('should successfully upsert profile with valid parameters', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: {
          fullName: 'Test Candidate',
          email: VALID_EMAIL,
          mobileNumber: VALID_PHONE,
          skills: ['TypeScript', 'Node.js'],
          githubUrl: 'https://github.com/candidate',
          linkedinUrl: 'https://linkedin.com/in/candidate',
          experience: 3,
          bio: 'Hello world',
        },
      } as unknown as Request;

      await candidateController.upsertProfile(req, mockRes);

      expect(mockCandidateService.upsertProfile).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.fullName).toBe('Test Candidate');
    });

    it('should fail validation when full name is missing', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: {
          email: VALID_EMAIL,
        },
      } as unknown as Request;

      expect(candidateController.upsertProfile(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('getProfile', () => {
    it('should return complete details for the candidate themselves', async () => {
      const req = {
        params: { userId: VALID_USER_ID },
        headers: { authorization: 'Bearer valid-token' },
      } as unknown as Request;

      mockAuthnService.verifyToken.mockResolvedValue({
        userId: VALID_USER_ID,
      });

      User.aggregate = mock(() => Promise.resolve([
        {
          _id: VALID_USER_ID,
          roleId: { roleName: 'Candidate' },
        },
      ])) as any;

      await candidateController.getProfile(req, mockRes);

      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.email).toBe(VALID_EMAIL);
      expect(mockRes.body.data.mobileNumber).toBe(VALID_PHONE);
    });

    it('should return complete details for HR users', async () => {
      const validHrId = '507f191e810c19729de860ea';
      const req = {
        params: { userId: VALID_USER_ID },
        headers: { authorization: 'Bearer hr-token' },
      } as unknown as Request;

      mockAuthnService.verifyToken.mockResolvedValue({
        userId: validHrId,
      });

      User.aggregate = mock(() => Promise.resolve([
        {
          _id: validHrId,
          roleId: { roleName: 'HR' },
        },
      ])) as any;

      await candidateController.getProfile(req, mockRes);

      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.email).toBe(VALID_EMAIL);
      expect(mockRes.body.data.mobileNumber).toBe(VALID_PHONE);
    });

    it('should return masked details for guests/unlogged in users', async () => {
      const req = {
        params: { userId: VALID_USER_ID },
        headers: {},
      } as unknown as Request;

      await candidateController.getProfile(req, mockRes);

      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.email).not.toBe(VALID_EMAIL);
      expect(mockRes.body.data.email).toContain('***');
      expect(mockRes.body.data.mobileNumber).not.toBe(VALID_PHONE);
      expect(mockRes.body.data.mobileNumber).toContain('***');
    });
  });

  describe('createBlog', () => {
    it('should successfully create blog', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: {
          title: 'My First Blog',
          content: 'This is a test blog post',
          blogKeywords: ['test'],
        },
      } as unknown as Request;

      await candidateController.createBlog(req, mockRes);

      expect(mockCandidateService.createBlog).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.title).toBe('My First Blog');
    });
  });

  describe('listBlogs', () => {
    it('should successfully list blogs with pagination', async () => {
      const req = {
        query: { page: '1', pageSize: '10' },
      } as unknown as Request;

      mockCandidateService.listBlogs.mockResolvedValue({
        data: [{ title: 'Blog 1' }],
        totalCount: 1,
      });

      await candidateController.listBlogs(req, mockRes);

      expect(mockCandidateService.listBlogs).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.totalCount).toBe(1);
    });

    it('should throw AppError if pagination query is invalid', async () => {
      const req = {
        query: { page: '-1' },
      } as unknown as Request;

      expect(candidateController.listBlogs(req, mockRes)).rejects.toThrow();
    });
  });

  describe('resumeOcr', () => {
    it('should successfully parse resume text and return extracted profile', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: { resumeText: 'Jane Doe\njane@example.com\nExperienced Software Engineer with skills in TypeScript and Node.js' },
      } as unknown as Request;

      await candidateController.resumeOcr(req, mockRes);

      expect(mockCandidateService.parseResumeOcr).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.fullName).toBe('Test Candidate');
      expect(mockRes.body.data.authenticInputNote).toBeDefined();
    });

    it('should throw AppError if userId header is missing', async () => {
      const req = {
        headers: {},
        body: { resumeText: 'Sample resume' },
      } as unknown as Request;

      expect(candidateController.resumeOcr(req, mockRes)).rejects.toThrow();
    });

    it('should throw validation error if both resumeText and fileBase64 are missing', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: {},
      } as unknown as Request;

      expect(candidateController.resumeOcr(req, mockRes)).rejects.toThrow();
    });
  });

  describe('improveBlog', () => {
    it('should successfully improve blog content using AI', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: {
          title: 'Scaling Distributed Systems',
          content: 'Here is an in-depth look at event sourcing architecture and fault tolerance.',
          aspect: 'technical_depth',
        },
      } as unknown as Request;

      await candidateController.improveBlog(req, mockRes);

      expect(mockCandidateService.improveBlogWithAi).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.title).toBe('Improved Title');
      expect(mockRes.body.data.authenticInputNote).toBeDefined();
    });

    it('should throw AppError if userId header is missing', async () => {
      const req = {
        headers: {},
        body: { title: 'Test', content: 'Test content here' },
      } as unknown as Request;

      expect(candidateController.improveBlog(req, mockRes)).rejects.toThrow();
    });

    it('should throw validation error if title or content is empty', async () => {
      const req = {
        headers: { userId: VALID_USER_ID },
        body: { title: '', content: '' },
      } as unknown as Request;

      expect(candidateController.improveBlog(req, mockRes)).rejects.toThrow();
    });
  });

  describe('convertMdToPdf', () => {
    it('should throw AppError if markdown content is empty', async () => {
      const req = {
        body: { content: '' },
      } as unknown as Request;

      expect(candidateController.convertMdToPdf(req, mockRes)).rejects.toThrow();
    });
  });
});
