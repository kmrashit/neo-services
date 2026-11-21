import { Router } from 'express';
import type { FortiController } from './forti.controller';
import type { CachingMiddleware } from '../../middleware/cache.middleware';

export class FortiRoutes {
  router: Router = Router();

  constructor(
    private fortiController: FortiController,
    private cacheMiddleware: CachingMiddleware,
  ) {
    this.initializeFortiRoutes();
  }

  private initializeFortiRoutes() {
    this.router.get(
      '/insights/:candidateId',
      this.fortiController.getInsights.bind(this.fortiController),
    );

    this.router.post(
      '/insights/generate/:candidateId',
      this.fortiController.synthesizeInsights.bind(this.fortiController),
    );

    this.router.get(
      '/chat/candidate/:userId',
      this.fortiController.chatWithCandidateProfile.bind(this.fortiController),
    );

    this.router.get(
      '/session',
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 60 * 60 * 2),
      this.fortiController.getSession.bind(this.fortiController),
    );
  }
}
