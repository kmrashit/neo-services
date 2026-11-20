import z from 'zod';
import { openApiRegistry } from '../../clients';
import { EmailValidation, FilterQueryValidation } from '../../validations/common-validation';
import { UserCreateValidation, UserIdValidation, UserUpdateValidation } from './user.validation';

export function registerUserRoutes() {
  openApiRegistry.register('EmailValidation', EmailValidation);

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Users'],
    path: '/user/getUsers',
    security: [{ bearerAuth: [] }],
    request: { query: FilterQueryValidation },
    responses: { 200: { description: 'Users fetched' } },
  });

  openApiRegistry.registerPath({
    method: 'get',
    tags: ['Users'],
    path: '/user/getUserById/',
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: UserCreateValidation } } } },
    responses: { 200: { description: 'User fetched by ID' } },
  });

  openApiRegistry.registerPath({
    method: 'post',
    tags: ['Users'],
    path: '/user/createUser',
    security: [{ bearerAuth: [] }],
    request: { body: { content: { 'application/json': { schema: UserUpdateValidation } } } },
    responses: { 201: { description: 'User created' } },
  });

  openApiRegistry.registerPath({
    method: 'put',
    tags: ['Users'],
    path: '/user/updateUserById/{userId}',
    security: [{ bearerAuth: [] }],
    request: { params: z.object({ userId: UserIdValidation }) },
    responses: { 200: { description: 'User updated' } },
  });

  openApiRegistry.registerPath({
    method: 'delete',
    tags: ['Users'],
    path: '/user/deleteUserById/{userId}',
    security: [{ bearerAuth: [] }],
    request: { params: z.object({ userId: UserIdValidation }) },
    responses: { 204: { description: 'User deleted' } },
  });
}
