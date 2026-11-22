import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { JobController } from '../src/modules/job/job.controller';
import { Request, Response } from 'express';

describe('JobController Unit Tests', () => {
  let jobController: JobController;
  let mockJobService: any;
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

  const VALID_HR_ID = '6b00d384ad1f89cf1068f538';
  const VALID_CANDIDATE_ID = '6b00d384ad1f89cf1068f52f';
  const VALID_JOB_ID = '6b0293df12c719df0157d099';

  beforeEach(() => {
    mockJobService = {
      createJob: mock(() => Promise.resolve({
        _id: VALID_JOB_ID,
        title: 'Staff Systems Engineer',
        companyName: 'TechCorp',
        profession: 'Engineering & Technology',
        location: 'Remote',
        workplaceType: 'Remote',
        experienceYears: 5,
        salaryRange: '$180,000 - $220,000',
        skills: ['TypeScript', 'Distributed Systems'],
        status: 'active',
        postedBy: VALID_HR_ID,
      })),
      getMyJobs: mock(() => Promise.resolve([
        {
          _id: VALID_JOB_ID,
          id: VALID_JOB_ID,
          title: 'Staff Systems Engineer',
          companyName: 'TechCorp',
          applicantCount: 2,
          status: 'active',
        },
      ])),
      updateJobStatus: mock((_hrId: string, _jobId: string, status: string) => Promise.resolve({
        _id: VALID_JOB_ID,
        status,
      })),
      searchJobs: mock(() => Promise.resolve([
        {
          _id: VALID_JOB_ID,
          id: VALID_JOB_ID,
          title: 'Staff Systems Engineer',
          companyName: 'TechCorp',
          status: 'active',
        },
      ])),
      getSuggestions: mock(() => Promise.resolve([
        {
          _id: VALID_JOB_ID,
          id: VALID_JOB_ID,
          title: 'Staff Systems Engineer',
          companyName: 'TechCorp',
          matchScore: 95,
        },
      ])),
      applyJob: mock((_candId: string, _jobId: string, coverNote?: string) => Promise.resolve({
        _id: 'app-1',
        jobId: VALID_JOB_ID,
        candidateId: VALID_CANDIDATE_ID,
        coverNote: coverNote || '',
        status: 'applied',
      })),
      getJobApplicants: mock(() => Promise.resolve([
        {
          applicationId: 'app-1',
          candidate: {
            fullName: 'Jane Candidate',
            email: 'candidate@test.com',
            headline: 'Staff Full Stack Engineer',
            learningVelocityScore: 94,
          },
        },
      ])),
    };

    jobController = new JobController(mockJobService);
    mockRes = mockResponse();
  });

  describe('createJob', () => {
    it('should successfully create a new job posting for HR', async () => {
      const mockReq = {
        headers: { userId: VALID_HR_ID },
        body: {
          title: 'Staff Systems Engineer',
          companyName: 'TechCorp',
          profession: 'Engineering & Technology',
          skills: ['TypeScript', 'Distributed Systems'],
        },
      } as unknown as Request;

      await jobController.createJob(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.title).toBe('Staff Systems Engineer');
    });

    it('should throw validation error when title is missing', async () => {
      const mockReq = {
        headers: { userId: VALID_HR_ID },
        body: {
          companyName: 'TechCorp',
          profession: 'Engineering & Technology',
          skills: ['TypeScript'],
        },
      } as unknown as Request;

      expect(jobController.createJob(mockReq, mockRes)).rejects.toThrow();
    });
  });

  describe('getMyJobs', () => {
    it('should return list of job postings for the HR user', async () => {
      const mockReq = {
        headers: { userId: VALID_HR_ID },
      } as unknown as Request;

      await jobController.getMyJobs(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.success).toBe(true);
      expect(mockRes.body.data.length).toBe(1);
    });
  });

  describe('updateJobStatus', () => {
    it('should update job status to closed', async () => {
      const mockReq = {
        headers: { userId: VALID_HR_ID },
        params: { jobId: VALID_JOB_ID },
        body: { status: 'closed' },
      } as unknown as Request;

      await jobController.updateJobStatus(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.status).toBe('closed');
    });
  });

  describe('searchJobs & getSuggestions', () => {
    it('should search jobs by query', async () => {
      const mockReq = {
        query: { searchKey: 'Systems' },
      } as unknown as Request;

      await jobController.searchJobs(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.length).toBe(1);
    });

    it('should return AI personalized suggestions for candidate', async () => {
      const mockReq = {
        headers: { userId: VALID_CANDIDATE_ID },
      } as unknown as Request;

      await jobController.getSuggestions(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data[0].matchScore).toBe(95);
    });
  });

  describe('applyJob & getJobApplicants', () => {
    it('should allow candidate to submit application', async () => {
      const mockReq = {
        headers: { userId: VALID_CANDIDATE_ID },
        params: { jobId: VALID_JOB_ID },
        body: { coverNote: 'Excited about this role!' },
      } as unknown as Request;

      await jobController.applyJob(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.status).toBe('applied');
    });

    it('should allow HR to view applicants for their job', async () => {
      const mockReq = {
        headers: { userId: VALID_HR_ID },
        params: { jobId: VALID_JOB_ID },
      } as unknown as Request;

      await jobController.getJobApplicants(mockReq, mockRes);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body.data.length).toBe(1);
      expect(mockRes.body.data[0].candidate.fullName).toBe('Jane Candidate');
    });
  });
});
