import { openApiRegistry } from '../../clients';
import { JobCreateValidation, JobStatusUpdateValidation, JobApplyValidation } from './job.validation';

export function registerJobRoutes() {
  openApiRegistry.registerPath({
    method: 'post',
    tags: ['Jobs'],
    path: '/job/create',
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: JobCreateValidation } } } },
    responses: { 200: { description: 'Job posting created successfully' } },
  });

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Jobs'],
    path: '/job/hr/my-posts',
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'Recruiter job postings fetched successfully' } },
  });

  openApiRegistry.registerPath({
    method: 'put',
    tags: ['Jobs'],
    path: '/job/{jobId}/status',
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: JobStatusUpdateValidation } } } },
    responses: { 200: { description: 'Job status updated successfully' } },
  });

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Jobs'],
    path: '/job/search',
    responses: { 200: { description: 'Job search results' } },
  });

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Jobs'],
    path: '/job/suggestions',
    security: [{ bearerAuth: [] }],
    responses: { 200: { description: 'AI personalized job suggestions' } },
  });

  openApiRegistry.registerPath({
    method: 'post',
    tags: ['Jobs'],
    path: '/job/apply/{jobId}',
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: JobApplyValidation } } } },
    responses: { 200: { description: 'Applied to job successfully' } },
  });
}
