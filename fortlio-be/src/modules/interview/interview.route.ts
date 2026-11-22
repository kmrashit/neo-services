import { Router } from 'express';
import type { InterviewController } from './interview.controller';
import type { AuthGuard } from '../../middleware/auth.middleware';

export class InterviewRoutes {
  public router: Router = Router();

  constructor(
    private interviewController: InterviewController,
    private authGuard: AuthGuard,
  ) {
    this.initializeInterviewRoutes();
  }

  private initializeInterviewRoutes(): void {
    this.router.post('/start', this.authGuard.checkAccess('startInterviewSession'), this.interviewController.startSession);
    this.router.post('/session/:id/respond', this.authGuard.checkAccess('respondInterviewSession'), this.interviewController.submitResponse);
    this.router.post('/session/:id/conclude', this.authGuard.checkAccess('concludeInterviewSession'), this.interviewController.concludeSession);
    this.router.get('/report/:id', this.interviewController.getReport);
    this.router.get('/my-history', this.authGuard.checkAccess('listMyInterviews'), this.interviewController.listMyInterviews);
    this.router.put('/session/:id/visibility', this.authGuard.checkAccess('concludeInterviewSession'), this.interviewController.toggleVisibility);
  }
}
