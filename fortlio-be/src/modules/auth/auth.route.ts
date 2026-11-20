import { Router } from 'express';
import { AuthnController } from './auth.controller';
import { AuthGuard } from '../../middleware/auth.middleware';

export class AuthnRoutes {
  router: Router = Router();

  constructor(
    private authnController: AuthnController,
    private authGuard: AuthGuard,
  ) {
    this.initializeAuthnRoutes();
  }

  private initializeAuthnRoutes() {
    this.router.post('/register', this.authnController.register);
    this.router.post('/login', this.authnController.login);
    this.router.get('/refreshToken', this.authGuard.checkAccess('refreshToken'), this.authnController.refreshToken);
    this.router.get('/logout', this.authnController.logout);
    this.router.get('/verifyEmail', this.authnController.verifyEmail);
    this.router.post('/resendVerification', this.authnController.resendVerification);
  }
}
