import { Router } from 'express';
import { UserRoutes, UserController, UserService } from '../modules/user';
import { AuthnRoutes, AuthnController, AuthnService } from '../modules/auth';
import { RoleRoutes, RoleController, RoleService } from '../modules/role';
import { CandidateRoutes, CandidateController, CandidateService } from '../modules/candidate';
import { HrRoutes, HrController, HrService, HistoryService } from '../modules/hr';
import { ConnectionRoutes, ConnectionController, ConnectionService } from '../modules/connection';
import { ShortnerRoutes, ShortnerController, ShortenerService } from '../modules/link-shortener';
import { LeetcodeRoutes, LeetcodeController, LeetcodeService } from '../modules/leetcode';
import { FortiRoutes, FortiController, FortiService } from '../modules/forti';
import { ServicesRoutes } from './services.route';
import { CachingMiddleware } from '../middleware/cache.middleware';
import { config } from '../../config';
import { mongoDbClient, llmClient, redisClient, secretManager, sesHelper, sensiSearch } from '../clients';
import { AuthGuard } from '../middleware/auth.middleware';
import { RestAuthMiddleware } from '../middleware/rest-auth.middleware';
import { ChecksumVerifyMiddleware } from '../middleware/checksum-middleware';

// ==========================================
// 2. SERVICES (BUSINESS LAYER)
// ==========================================
const userService = new UserService();
const authnService = new AuthnService(secretManager, sesHelper);
const roleService = new RoleService();
const fortiService = new FortiService(llmClient, sensiSearch);
const shortenerService = new ShortenerService();
const leetcodeService = new LeetcodeService(llmClient, secretManager);
const candidateService = new CandidateService();
const hrService = new HrService();
const connectionService = new ConnectionService();
const historyService = new HistoryService();

// ==========================================
// 3. CONTROLLERS (ORCHESTRATION LAYER)
// ==========================================
const userController = new UserController(userService, roleService);
const authnController = new AuthnController(authnService);
const fortiController = new FortiController(fortiService);
const roleController = new RoleController(roleService);
const shortnerController = new ShortnerController(shortenerService);
const leetcodeController = new LeetcodeController(leetcodeService);
const candidateController = new CandidateController(candidateService, authnService, userService);
const hrController = new HrController(hrService, historyService, userService, authnService);
const connectionController = new ConnectionController(connectionService);

// ==========================================
// 1. INFRASTRUCTURE & MIDDLEWARE
// ==========================================
const cacheMiddleware = new CachingMiddleware(config);
const restAuthMiddleware = new RestAuthMiddleware(mongoDbClient, redisClient, authnService);
const authGuard = new AuthGuard(restAuthMiddleware);
const checksumVerifyMiddleware = new ChecksumVerifyMiddleware(config);

// ==========================================
// 4. SUB-ROUTERS (DELIVERY LAYER)
// ==========================================
const authnRoutes = new AuthnRoutes(authnController, authGuard);
const userRoutes = new UserRoutes(userController, cacheMiddleware, authGuard, checksumVerifyMiddleware);
const roleRoutes = new RoleRoutes(roleController, cacheMiddleware, authGuard);
const fortiRoutes = new FortiRoutes(fortiController, cacheMiddleware);
const shortnerRoutes = new ShortnerRoutes(shortnerController, cacheMiddleware, authGuard);
const leetcodeRoutes = new LeetcodeRoutes(leetcodeController, cacheMiddleware);
const servicesRoutes = new ServicesRoutes(cacheMiddleware, leetcodeRoutes, shortnerRoutes);
const candidateRoutes = new CandidateRoutes(candidateController, authGuard);
const hrRoutes = new HrRoutes(hrController, authGuard, checksumVerifyMiddleware);
const connectionRoutes = new ConnectionRoutes(connectionController, authGuard);

class AppRoutes {
  router: Router = Router();

  constructor(
    private cacheMiddleware: CachingMiddleware,
    private authnRoutes: AuthnRoutes,
    private userRoutes: UserRoutes,
    private roleRoutes: RoleRoutes,
    private servicesRoutes: ServicesRoutes,
    private candidateRoutes: CandidateRoutes,
    private hrRoutes: HrRoutes,
    private connectionRoutes: ConnectionRoutes,
    private fortiRoutes: FortiRoutes,
  ) {
    this.initializeRoutes();
  }

  private initializeRoutes() {
    this.router.use('/auth', this.authnRoutes.router);
    this.router.use('/user', this.userRoutes.router);
    this.router.use('/role', this.cacheMiddleware.cacheReqRes.bind(this.cacheMiddleware), this.roleRoutes.router);
    this.router.use('/services', this.cacheMiddleware.cacheReqRes.bind(this.cacheMiddleware), this.servicesRoutes.router);
    this.router.use('/candidate', this.candidateRoutes.router);
    this.router.use('/hr', this.hrRoutes.router);
    this.router.use('/connections', this.connectionRoutes.router);
    this.router.use('/forti', this.fortiRoutes.router);
  }
}

const appRoutes = new AppRoutes(
  cacheMiddleware,
  authnRoutes,
  userRoutes,
  roleRoutes,
  servicesRoutes,
  candidateRoutes,
  hrRoutes,
  connectionRoutes,
  fortiRoutes,
);

export default appRoutes;
