import { Router } from 'express';
import type { JobController } from './job.controller';
import type { AuthGuard } from '../../middleware/auth.middleware';

export class JobRoutes {
  public router: Router = Router();

  constructor(
    private jobController: JobController,
    private authGuard: AuthGuard,
  ) {
    this.initializeJobRoutes();
  }

  private initializeJobRoutes(): void {
    // HR Recruiter Endpoints
    this.router.post('/create', this.authGuard.checkAccess('createJob'), this.jobController.createJob);
    this.router.get('/hr/my-posts', this.authGuard.checkAccess('getMyJobs'), this.jobController.getMyJobs);
    this.router.put('/:jobId/status', this.authGuard.checkAccess('updateJob'), this.jobController.updateJobStatus);
    this.router.get('/:jobId/applicants', this.authGuard.checkAccess('getJobApplicants'), this.jobController.getJobApplicants);

    // Candidate & Discovery Endpoints
    this.router.get('/search', this.jobController.searchJobs);
    this.router.get('/suggestions', this.authGuard.checkAccess('getJobSuggestions'), this.jobController.getSuggestions);
    this.router.post('/apply/:jobId', this.authGuard.checkAccess('applyJob'), this.jobController.applyJob);
  }
}
