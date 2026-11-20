import { Request, Response, NextFunction } from 'express';
import { RedisService } from '../../core/core-clients/redis-service.client';
import { Config } from '../../interface/common.interface';

export class FortiLLMMiddleware {
  private redisService: RedisService;
  private config: Config;

  constructor(config: Config) {
    this.redisService = new RedisService(config);
    this.config = config;
  }

  validateSession = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const sessionId = req.cookies?.sessionId;

      if (!sessionId) {
        res.status(401).json({ error: 'No session' });
        return;
      }

      const key = `session:${this.config.appEnv}:${sessionId}`;
      const session = await this.redisService.get(key);

      if (!session) {
        res.status(401).json({ error: 'Invalid session' });
        return;
      }

      (req as any).session = JSON.parse(session);
      (req as any).sessionId = sessionId;

      next();
    } catch (err) {
      console.error('Session middleware error:', err);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
}
