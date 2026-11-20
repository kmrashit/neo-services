import { Router } from 'express';
import type { CachingMiddleware } from '../../middleware/cache.middleware';
import type { FortiLLMController } from './forti-llm.controller';

export class FortiLLMRoutes {
  router: Router = Router();

  constructor(private fortiLLMController: FortiLLMController, private cacheMiddleware: CachingMiddleware) {
    this.initializeFortiLLMRoutes();
  }

  private initializeFortiLLMRoutes() {
    this.router.get('/forti', this.fortiLLMController.getAnswerFromQuestion.bind(this.fortiLLMController));

    this.router.get(
      '/session',
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 60 * 60 * 2),
      this.fortiLLMController.getSession.bind(this.fortiLLMController),
    );
  }
}
