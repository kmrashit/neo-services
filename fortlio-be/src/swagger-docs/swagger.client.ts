import { OpenApiGeneratorV3 } from '@asteasolutions/zod-to-openapi';
import { backendBaseURL, openApiRegistry } from '../clients';
import { registerUserRoutes } from '../modules/user';
import { registerRoleRoutes } from '../modules/role';
import { registerAuthnRoutes } from '../modules/auth';
import { registerShortenerRoutes } from '../modules/link-shortener';
import { registerLeetcodeRoutes } from '../modules/leetcode';
import { registerCandidateRoutes } from '../modules/candidate';
import { registerHrRoutes } from '../modules/hr';
import { registerConnectionRoutes } from '../modules/connection';

openApiRegistry.registerComponent('securitySchemes', 'bearerAuth', { type: 'http', scheme: 'bearer', bearerFormat: 'JWT' });

// Register routes here
registerAuthnRoutes();
registerCandidateRoutes();
registerHrRoutes();
registerConnectionRoutes();
registerLeetcodeRoutes();
registerUserRoutes();
registerRoleRoutes();
registerShortenerRoutes();

export function generateOpenApiDocs() {
  const generator = new OpenApiGeneratorV3(openApiRegistry.definitions);

  return generator.generateDocument({
    openapi: '3.0.0',
    info: { title: 'Fortlio API', version: '1.0.0' },
    servers: [
      { url: 'http://localhost:4020', description: 'Local server' },
      { url: 'https://testing-be.dev.argus.obenelectric.com', description: 'Testing server' },
      { url: backendBaseURL, description: 'Production server' },
    ],
  });
}
