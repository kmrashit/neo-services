import { openApiRegistry } from '../../clients';
import { IsKeyAvailableValidation, ShortItValidation, ShortValueValidation } from './shortener.validation';

export function registerShortenerRoutes() {
  openApiRegistry.registerPath({
    method: 'post',
    tags: ['Shortener'],
    path: '/services/shorten/shortIt',
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: ShortItValidation } } } },
    responses: { 201: { description: 'Short URL created' } },
  });

  openApiRegistry.registerPath({
    method: 'post',
    tags: ['Shortener'],
    path: '/services/shorten/shortItByGuest',
    request: { body: { content: { 'application/json': { schema: ShortItValidation } } } },
    responses: { 201: { description: 'Guest short URL created' } },
  });

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Shortener'],
    path: '/services/shorten/s/{shortValue}',
    request: { params: ShortValueValidation },
    responses: { 200: { description: 'Redirect to original URL' } },
  });

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Shortener'],
    path: '/services/shorten/isAvailable',
    request: { query: IsKeyAvailableValidation },
    responses: { 200: { description: 'Check if short URL key is available' } },
  });
}
