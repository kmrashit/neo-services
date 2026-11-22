import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { AppError } from '../src/core/core-utils/err-util';
import { FortiController } from '../src/modules/forti/forti.controller';
import { Request, Response } from 'express';

describe('FortiController Unit Tests', () => {
  let fortiController: FortiController;
  let mockFortiService: any;
  let mockRes: any;

  const mockResponse = () => {
    const res: any = {};
    res.statusCode = 200;
    res.headers = {};
    res.writtenData = [] as string[];
    res.ended = false;

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
    res.setHeader = mock((key: string, value: string) => {
      res.headers[key] = value;
      return res;
    });
    res.flushHeaders = mock(() => undefined);
    res.write = mock((data: string) => {
      res.writtenData.push(data);
      return true;
    });
    res.end = mock(() => {
      res.ended = true;
      return res;
    });
    res.cookie = mock(() => res);

    return res as unknown as Response;
  };

  const VALID_CANDIDATE_ID = '123456789012345678901234';
  const VALID_USER_ID = '123456789012345678901234';

  const MOCK_INSIGHTS = {
    _id: '507f1f77bcf86cd799439011',
    candidateId: VALID_CANDIDATE_ID,
    learningVelocity: {
      score: 95,
      summary: 'Demonstrates rapid velocity in systems engineering.',
      progressionRate: 'rapid',
    },
    knowledgeVolume: {
      articleCount: 3,
      depthLevel: 'advanced',
    },
    topicDiversity: {
      primaryDomains: ['Distributed Systems', 'MongoDB', 'Redis'],
      exploredTopics: ['Bun', 'Kafka', 'Kubernetes'],
      diversityScore: 9.4,
    },
    detectedQualities: {
      leadership: ['System Architecture', 'Mentorship'],
      mindset: ['Curious', 'Problem-Solver'],
    },
    rawAiSummary: 'Synthesized talent profile demonstrates deep domain mastery.',
  };

  beforeEach(() => {
    mockFortiService = {
      getInsights: mock(() => Promise.resolve(MOCK_INSIGHTS)),
      synthesizeInsights: mock(() => Promise.resolve(MOCK_INSIGHTS)),
      chatWithCandidateProfile: mock(async (_userId: string, _question: string, onChunk: (text: string) => void) => {
        onChunk('Candidate demonstrates strong architecture experience. ');
        return 'Candidate demonstrates strong architecture experience.';
      }),
    };

    fortiController = new FortiController(mockFortiService);
    mockRes = mockResponse();
  });

  describe('getInsights', () => {
    it('should successfully return candidate insights when found', async () => {
      const req = {
        params: { candidateId: VALID_CANDIDATE_ID },
      } as unknown as Request;

      await fortiController.getInsights(req, mockRes);

      expect(mockFortiService.getInsights).toHaveBeenCalledWith(VALID_CANDIDATE_ID);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.learningVelocity.score).toBe(95);
    });

    it('should throw AppError with 404 if insights are not found', async () => {
      mockFortiService.getInsights.mockResolvedValue(null);

      const req = {
        params: { candidateId: VALID_CANDIDATE_ID },
      } as unknown as Request;

      expect(fortiController.getInsights(req, mockRes)).rejects.toThrow(AppError);
    });

    it('should throw AppError if candidateId is not 24 characters', async () => {
      const req = {
        params: { candidateId: 'invalid-id' },
      } as unknown as Request;

      expect(fortiController.getInsights(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('synthesizeInsights', () => {
    it('should successfully synthesize and return insights', async () => {
      const req = {
        params: { candidateId: VALID_CANDIDATE_ID },
      } as unknown as Request;

      await fortiController.synthesizeInsights(req, mockRes);

      expect(mockFortiService.synthesizeInsights).toHaveBeenCalledWith(VALID_CANDIDATE_ID);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.learningVelocity.progressionRate).toBe('rapid');
    });

    it('should throw AppError if validation fails on candidateId', async () => {
      const req = {
        params: { candidateId: 'short' },
      } as unknown as Request;

      expect(fortiController.synthesizeInsights(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('chatWithCandidateProfile', () => {
    it('should set SSE headers and stream chunks for valid question', async () => {
      const req = {
        params: { userId: VALID_USER_ID },
        query: { question: 'What is their distributed systems background?' },
      } as unknown as Request;

      await fortiController.chatWithCandidateProfile(req, mockRes);

      expect(mockRes.headers['Content-Type']).toBe('text/event-stream');
      expect(mockRes.headers['Cache-Control']).toBe('no-cache');
      expect(mockRes.headers['Connection']).toBe('keep-alive');
      expect(mockRes.writtenData.length).toBeGreaterThan(0);
      expect(mockRes.ended).toBe(true);
    });

    it('should throw AppError if question is missing or empty', async () => {
      const req = {
        params: { userId: VALID_USER_ID },
        query: { question: '' },
      } as unknown as Request;

      expect(fortiController.chatWithCandidateProfile(req, mockRes)).rejects.toThrow(AppError);
    });

    it('should throw AppError if userId is invalid', async () => {
      const req = {
        params: { userId: 'bad-id' },
        query: { question: 'Tell me about their skills' },
      } as unknown as Request;

      expect(fortiController.chatWithCandidateProfile(req, mockRes)).rejects.toThrow(AppError);
    });
  });

  describe('getSession', () => {
    it('should successfully return session response and set cookie', async () => {
      const req = {} as Request;

      await fortiController.getSession(req, mockRes);

      expect(mockRes.cookie).toHaveBeenCalled();
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.sessionId).toBeDefined();
    });
  });
});
