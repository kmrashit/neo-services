import { expect, describe, it, mock, beforeEach } from 'bun:test';
import { AppError } from '../src/core/core-utils/err-util';
import { RoleController } from '../src/modules/role/role.controller';
import * as ROLE_MSGS from '../src/modules/role/role.constants';
import { Request, Response } from 'express';

describe('RoleController Unit Tests', () => {
  let roleController: RoleController;
  let mockRoleService: any;
  let mockRes: any;

  const mockResponse = () => {
    const res: any = {};
    res.status = mock((code: number) => {
      res.statusCode = code;
      return res;
    });
    res.send = mock((body: any) => {
      res.body = body;
      return res;
    });
    res.json = mock((body: any) => {
      res.body = body;
      return res;
    });
    return res as unknown as Response;
  };

  const VALID_ROLE_ID = '567890123456789012345678';
  const VALID_USER_ID = '123456789012345678901234';

  beforeEach(() => {
    mockRoleService = {
      getRoles: mock(() => Promise.resolve([])),
      getRolesWithPrivileges: mock(() => Promise.resolve({ data: [], total: 0 })),
      getPrivileges: mock(() => Promise.resolve({ data: [], total: 0 })),
      getRoleById: mock(() => Promise.resolve(null)),
      getRoleByName: mock(() => Promise.resolve(null)),
      createRole: mock(() => Promise.resolve({})),
      updateRole: mock(() => Promise.resolve(null)),
      deleteRoleById: mock(() => Promise.resolve(null)),
    };

    roleController = new RoleController(mockRoleService);
    mockRes = mockResponse();
  });

  describe('getRoles', () => {
    it('should successfully get roles with mapped roleId', async () => {
      const req = {} as Request;
      mockRoleService.getRoles.mockResolvedValue([
        {
          toObject: () => ({
            _id: VALID_ROLE_ID,
            roleName: 'candidate',
            description: 'Candidate role',
          }),
        },
      ]);

      await roleController.getRoles(req, mockRes);

      expect(mockRoleService.getRoles).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: [
          {
            roleId: VALID_ROLE_ID,
            roleName: 'candidate',
            description: 'Candidate role',
          },
        ],
      });
    });

    it('should throw AppError if roleService.getRoles throws', async () => {
      const req = {} as Request;
      mockRoleService.getRoles.mockRejectedValue(new Error('Database error'));

      expect(roleController.getRoles(req, mockRes)).rejects.toThrow(
        new AppError('Database error'),
      );
    });
  });

  describe('getRolesWithPrivileges', () => {
    it('should successfully fetch roles with privileges using pagination defaults', async () => {
      const req = {
        query: { page: 1, pageSize: 10 },
      } as unknown as Request;

      const expectedData = { data: [{ roleName: 'hr', privileges: [] }], total: 1 };
      mockRoleService.getRolesWithPrivileges.mockResolvedValue(expectedData);

      await roleController.getRolesWithPrivileges(req, mockRes);

      expect(mockRoleService.getRolesWithPrivileges).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: expectedData,
      });
    });

    it('should throw AppError if validation fails on filter query', async () => {
      const req = {
        query: { page: 'invalid-number' },
      } as unknown as Request;

      expect(roleController.getRolesWithPrivileges(req, mockRes)).rejects.toThrow();
    });
  });

  describe('getPrivileges', () => {
    it('should successfully fetch privileges', async () => {
      const req = {
        query: { page: 1, pageSize: 10 },
      } as unknown as Request;

      const privilegesResult = { data: [{ name: 'canSearch', tag: 'hr' }], total: 1 };
      mockRoleService.getPrivileges.mockResolvedValue(privilegesResult);

      await roleController.getPrivileges(req, mockRes);

      expect(mockRoleService.getPrivileges).toHaveBeenCalled();
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: privilegesResult,
      });
    });

    it('should throw AppError if service fails', async () => {
      const req = {
        query: { page: 1, pageSize: 10 },
      } as unknown as Request;

      mockRoleService.getPrivileges.mockRejectedValue(new Error('Fetch failed'));

      expect(roleController.getPrivileges(req, mockRes)).rejects.toThrow(
        new AppError('Fetch failed'),
      );
    });
  });

  describe('getRoleById', () => {
    it('should successfully fetch role by ID', async () => {
      const req = {
        params: { roleId: VALID_ROLE_ID },
      } as unknown as Request;

      mockRoleService.getRoleById.mockResolvedValue({
        toObject: () => ({
          _id: VALID_ROLE_ID,
          roleName: 'admin',
          description: 'Administrator role',
        }),
      });

      await roleController.getRoleById(req, mockRes);

      expect(mockRoleService.getRoleById).toHaveBeenCalledWith(VALID_ROLE_ID);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: {
          roleId: VALID_ROLE_ID,
          _id: VALID_ROLE_ID,
          roleName: 'admin',
          description: 'Administrator role',
        },
      });
    });

    it('should throw AppError if role ID is invalid length', async () => {
      const req = {
        params: { roleId: 'shortId' },
      } as unknown as Request;

      expect(roleController.getRoleById(req, mockRes)).rejects.toThrow();
    });

    it('should throw AppError if role is not found', async () => {
      const req = {
        params: { roleId: VALID_ROLE_ID },
      } as unknown as Request;

      mockRoleService.getRoleById.mockResolvedValue(null);

      expect(roleController.getRoleById(req, mockRes)).rejects.toThrow(
        new AppError(ROLE_MSGS.ERR.ROLE_NOT_FOUND),
      );
    });
  });

  describe('createRole', () => {
    it('should successfully create a role', async () => {
      const roleData = {
        roleName: 'moderator',
        description: 'Moderator role for community',
        rolePrivileges: ['edit_post', 'delete_post'],
      };

      const req = {
        body: roleData,
        user: { userId: VALID_USER_ID },
      } as unknown as Request;

      mockRoleService.createRole.mockResolvedValue({
        toObject: () => ({
          _id: VALID_ROLE_ID,
          ...roleData,
          createdBy: VALID_USER_ID,
        }),
      });

      await roleController.createRole(req, mockRes);

      expect(mockRoleService.createRole).toHaveBeenCalledWith(
        roleData.roleName,
        roleData.description,
        roleData.rolePrivileges,
        VALID_USER_ID,
      );
      expect(mockRes.statusCode).toBe(201);
      expect(mockRes.body).toEqual({
        roleId: VALID_ROLE_ID,
        ...roleData,
        createdBy: VALID_USER_ID,
      });
    });

    it('should throw AppError if validation fails when creating role', async () => {
      const req = {
        body: { roleName: '' },
      } as unknown as Request;

      expect(roleController.createRole(req, mockRes)).rejects.toThrow();
    });
  });

  describe('updateRole', () => {
    it('should successfully update role', async () => {
      const updateData = {
        roleId: VALID_ROLE_ID,
        roleName: 'super-admin',
        description: 'Updated description',
        rolePrivileges: ['all'],
      };

      const req = {
        body: updateData,
        user: { userId: VALID_USER_ID },
      } as unknown as Request;

      mockRoleService.updateRole.mockResolvedValue({
        toObject: () => ({
          _id: VALID_ROLE_ID,
          roleName: updateData.roleName,
          description: updateData.description,
          rolePrivileges: updateData.rolePrivileges,
          modifiedBy: VALID_USER_ID,
        }),
      });

      await roleController.updateRole(req, mockRes);

      expect(mockRoleService.updateRole).toHaveBeenCalledWith(
        updateData.roleId,
        updateData.roleName,
        updateData.description,
        updateData.rolePrivileges,
        VALID_USER_ID,
      );
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: {
          roleId: VALID_ROLE_ID,
          roleName: updateData.roleName,
          description: updateData.description,
          rolePrivileges: updateData.rolePrivileges,
          modifiedBy: VALID_USER_ID,
        },
      });
    });

    it('should throw AppError if role to update is not found', async () => {
      const updateData = {
        roleId: VALID_ROLE_ID,
        roleName: 'super-admin',
      };

      const req = {
        body: updateData,
        user: { userId: VALID_USER_ID },
      } as unknown as Request;

      mockRoleService.updateRole.mockResolvedValue(null);

      expect(roleController.updateRole(req, mockRes)).rejects.toThrow(
        new AppError(ROLE_MSGS.ERR.ROLE_NOT_FOUND),
      );
    });
  });

  describe('deleteRole', () => {
    it('should successfully delete role', async () => {
      const req = {
        params: { roleId: VALID_ROLE_ID },
      } as unknown as Request;

      mockRoleService.deleteRoleById.mockResolvedValue({
        toObject: () => ({
          _id: VALID_ROLE_ID,
          roleName: 'obsolete-role',
        }),
      });

      await roleController.deleteRole(req, mockRes);

      expect(mockRoleService.deleteRoleById).toHaveBeenCalledWith(VALID_ROLE_ID);
      expect(mockRes.statusCode).toBe(200);
      expect(mockRes.body).toEqual({
        success: true,
        data: {
          roleId: VALID_ROLE_ID,
          _id: VALID_ROLE_ID,
          roleName: 'obsolete-role',
        },
      });
    });

    it('should throw AppError if role to delete is not found', async () => {
      const req = {
        params: { roleId: VALID_ROLE_ID },
      } as unknown as Request;

      mockRoleService.deleteRoleById.mockResolvedValue(null);

      expect(roleController.deleteRole(req, mockRes)).rejects.toThrow(
        new AppError(ROLE_MSGS.ERR.ROLE_NOT_FOUND),
      );
    });
  });
});
