import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { InterviewController } from '../src/modules/interview/interview.controller';
import { Request, Response } from 'express';

describe('InterviewController Unit Tests', () => {
  let interviewController: InterviewController;
  let mockInterviewService: any;
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

  const VALID_CANDIDATE_ID = '6b00d384ad1f89cf1068f52f';
  const VALID_SESSION_ID = '6b0293df12c719df0157d099';

  beforeEach(() => {
    mockInterviewService = {
      startSession: mock(() => Promise.resolve({
        _id: VALID_SESSION_ID,
        id: VALID_SESSION_ID,
        candidateId: VALID_CANDIDATE_ID,
        profession: 'Engineering & Technology',
        specialty: 'Distributed Systems',
        targetLevel: 'Senior',
        status: 'in-progress',
        currentTurn: 0,
        turns: [
          {
            turnNumber: 1,
            question: 'Can you describe how you handle split-brain in distributed consensus?',
            askedAt: new Date(),
          },
        ],
      })),
      submitResponse: mock(() => Promise.resolve({
        turnCompleted: 1,
        maxTurns: 4,
        nextQuestion: 'What trade-offs do you make between Paxos and Raft?',
        isComplete: false,
      })),
      concludeSession: mock(() => Promise.resolve({
        _id: VALID_SESSION_ID,
        id: VALID_SESSION_ID,
        status: 'completed',
        scorecard: {
          overallScore: 88,
          readinessBadge: 'Domain Specialist',
          domainDepthScore: 90,
          problemSolvingScore: 85,
          communicationScore: 88,
          leadershipScore: 89,
          strengths: ['Deep knowledge of Raft quorum mechanics'],
          areasForImprovement: ['Mention failover latency metrics'],
          summary: 'Outstanding technical precision.',
        },
      })),
      getReport: mock(() => Promise.resolve({
        id: VALID_SESSION_ID,
        profession: 'Engineering & Technology',
        specialty: 'Distributed Systems',
        targetSeniority: 'Senior',
        status: 'completed',
        scorecard: {
          overallScore: 88,
          readinessBadge: 'Domain Specialist',
          domainDepthScore: 90,
          problemSolvingScore: 85,
          communicationScore: 88,
          leadershipScore: 89,
          strengths: ['Deep knowledge of Raft quorum mechanics'],
          areasForImprovement: ['Mention failover latency metrics'],
          summary: 'Outstanding technical precision.',
        },
        turns: [],
        createdAt: new Date(),
      })),
      listMyInterviews: mock(() => Promise.resolve([
        {
          _id: VALID_SESSION_ID,
          id: VALID_SESSION_ID,
          specialty: 'Distributed Systems',
          targetLevel: 'Senior',
          status: 'completed',
          scorecard: {
            overallScore: 88,
            readinessBadge: 'Domain Specialist',
          },
        },
      ])),
      togglePublicReport: mock((_candId: string, _sessionId: string, isPublic: boolean) => Promise.resolve({
        _id: VALID_SESSION_ID,
        isPublic,
      })),
    };

    interviewController = new InterviewController(mockInterviewService);
    mockRes = mockResponse();
  });

  describe('startSession', () => {
    it('successfully starts an interview session for candidate', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        body: {
          profession: 'Engineering & Technology',
          specialty: 'Distributed Systems',
          targetLevel: 'Senior',
        },
      } as unknown as Request;

      await interviewController.startSession(req, mockRes);
      expect(mockInterviewService.startSession).toHaveBeenCalledTimes(1);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.specialty).toBe('Distributed Systems');
    });

    it('throws 401 when userId header is missing', async () => {
      const req = {
        headers: {},
        body: {
          profession: 'Engineering & Technology',
          specialty: 'Distributed Systems',
        },
      } as unknown as Request;

      expect(interviewController.startSession(req, mockRes)).rejects.toThrow();
    });

    it('rejects invalid payload with missing profession', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        body: {
          specialty: 'Distributed Systems',
        },
      } as unknown as Request;

      expect(interviewController.startSession(req, mockRes)).rejects.toThrow();
    });
  });

  describe('submitResponse', () => {
    it('successfully submits answer for current turn', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { id: VALID_SESSION_ID },
        body: {
          answerText: 'Split brain can be resolved using quorum leases and odd-numbered leader elections.',
          audioDurationSeconds: 45,
        },
      } as unknown as Request;

      await interviewController.submitResponse(req, mockRes);
      expect(mockInterviewService.submitResponse).toHaveBeenCalledTimes(1);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.turnCompleted).toBe(1);
    });

    it('throws error when answer is missing or empty', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { id: VALID_SESSION_ID },
        body: {
          answerText: '',
        },
      } as unknown as Request;

      expect(interviewController.submitResponse(req, mockRes)).rejects.toThrow();
    });

    it('throws error when session id param is invalid', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { id: 'invalid-id' },
        body: {
          answerText: 'Some valid answer text.',
        },
      } as unknown as Request;

      expect(interviewController.submitResponse(req, mockRes)).rejects.toThrow();
    });
  });

  describe('concludeSession', () => {
    it('successfully concludes session and yields scorecard', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { id: VALID_SESSION_ID },
      } as unknown as Request;

      await interviewController.concludeSession(req, mockRes);
      expect(mockInterviewService.concludeSession).toHaveBeenCalledTimes(1);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.scorecard.overallScore).toBe(88);
    });

    it('throws 401 when userId is missing', async () => {
      const req = {
        headers: {},
        params: { id: VALID_SESSION_ID },
      } as unknown as Request;

      expect(interviewController.concludeSession(req, mockRes)).rejects.toThrow();
    });
  });

  describe('getReport', () => {
    it('successfully retrieves scorecard and report', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { id: VALID_SESSION_ID },
      } as unknown as Request;

      await interviewController.getReport(req, mockRes);
      expect(mockInterviewService.getReport).toHaveBeenCalledTimes(1);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.scorecard.readinessBadge).toBe('Domain Specialist');
    });
  });

  describe('listMyInterviews', () => {
    it('successfully lists interviews for authenticated candidate', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        query: { page: '1', pageSize: '10' },
      } as unknown as Request;

      await interviewController.listMyInterviews(req, mockRes);
      expect(mockInterviewService.listMyInterviews).toHaveBeenCalledTimes(1);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.length).toBe(1);
    });
  });

  describe('toggleVisibility', () => {
    it('successfully toggles report visibility', async () => {
      const req = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { id: VALID_SESSION_ID },
        body: { isPublic: true },
      } as unknown as Request;

      await interviewController.toggleVisibility(req, mockRes);
      expect(mockInterviewService.togglePublicReport).toHaveBeenCalledTimes(1);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.isPublic).toBe(true);
    });
  });
});
