import { Router } from 'express';
import { ShortnerController } from './shortener.controller';
import { AuthGuard } from '../../middleware/auth.middleware';
import { CachingMiddleware } from '../../middleware/cache.middleware';

export class ShortnerRoutes {
  router: Router = Router();

  constructor(
    private shortUrlController: ShortnerController,
    private cacheMiddleware: CachingMiddleware,
    private authGuard: AuthGuard,
  ) {
    this.initializeShortnerRoutes();
  }

  private initializeShortnerRoutes() {
    this.router.post(
      '/shortIt',
      this.authGuard.authenticate,
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 0),
      this.shortUrlController.createShortUrl.bind(this.shortUrlController),
    );

    this.router.post(
      '/shortItByGuest',
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 0),
      this.shortUrlController.createShortUrlByGuest.bind(this.shortUrlController),
    );

    this.router.get(
      '/s/:shortValue',
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 0),
      this.shortUrlController.redirectToUrl.bind(this.shortUrlController),
    );

    this.router.post(
      '/analytics/dwell-time',
      this.shortUrlController.recordDwellTime.bind(this.shortUrlController),
    );

    this.router.get(
      '/analytics/:shortCode',
      this.shortUrlController.getLinkAnalytics.bind(this.shortUrlController),
    );

    this.router.get(
      '/my-links',
      this.authGuard.authenticate,
      this.shortUrlController.getMyLinks.bind(this.shortUrlController),
    );

    this.router.get(
      '/isAvailable',
      this.authGuard.checkAccess('isAvailable'),
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 0),
      this.shortUrlController.isAvailable.bind(this.shortUrlController),
    );

    this.router.get(
      '/is-available',
      this.authGuard.checkAccess('isAvailable'),
      (req, res, next) => this.cacheMiddleware.cacheReqRes(req, res, next, 0),
      this.shortUrlController.isAvailable.bind(this.shortUrlController),
    );
  }
}
