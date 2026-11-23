import { Request, Response } from 'express';
import { UserService } from './user.service';
import { FilterQueryValidation } from '../../validations/common-validation';
import { UserCreateValidation, UserIdValidation, UserUpdateValidation, CreditCardPaymentValidation, ToggleAiOptInValidation } from './user.validation';
import { IUserCreate, IUserUpdate } from '../../interface/user-interface';
import { RoleService } from '../role/role.service';
import { fmtRes } from '../../core/core-utils/res-util';
import { AppError } from '../../core/core-utils/err-util';
import * as USER_MSGS from './user.constants';
import { IFilter } from '../../interface/common.interface';

export class UserController {

  constructor(private userService: UserService,
    private roleService: RoleService) {
  }

  getUsers = async (req: Request, res: Response) => {
    try {
      const { page, pageSize } = req.query as IFilter;
      FilterQueryValidation.parse({ page, pageSize });
      const users = await this.userService.getUsers({ page, pageSize });

      return fmtRes(res, users);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_FETCH_USERS, apiName: 'getUsers', debugValues: { query: req.query }, error }, 400);
    }
  };
  getUserById = async (req: Request, res: Response) => {
    try {
      const queryUserId = (req.query && req.query.userId) ? (req.query.userId as string) : '';
      const headerUserId = (req.headers && req.headers.userId) ? (req.headers.userId as string) : '';
      const userId = queryUserId || headerUserId;

      UserIdValidation.parse(userId);

      let user = await this.userService.getUserByUserId(userId);

      // If requested userId was not found but authenticated user is different, fallback to authenticated user
      if (!user && headerUserId && headerUserId !== userId) {
        user = await this.userService.getUserByUserId(headerUserId);
      }

      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'getUserById', debugValues: { userId } });
      }

      return fmtRes(res, user);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_FETCH_USER, apiName: 'getUserById', error }, error.statusCode || 400);
    }
  };

  createUser = async (req: Request, res: Response) => {
    try {
      const input: IUserCreate = req.body;

      UserCreateValidation.parse(input);

      // email is mandatory + unique
      const existingEmail = await this.userService.getUserByEmail(input.email);

      if (existingEmail) {
        throw new AppError(USER_MSGS.ERR.EMAIL_ALREADY_EXISTS, { msg: USER_MSGS.ERR.EMAIL_ALREADY_EXISTS, apiName: 'createUser', debugValues: { email: input.email } });
      }

      const role = await this.roleService.getRoleById(input.roleId);

      if (!role) {
        throw new AppError(USER_MSGS.ERR.ROLE_NOT_FOUND, { msg: USER_MSGS.ERR.ROLE_NOT_FOUND, apiName: 'createUser', debugValues: { roleId: input.roleId } });
      }

      const user = await this.userService.createUser(input);

      const { _id: userId, ...userDetails } = user.toObject();
      const { _id: roleId, ...roleDetails } = role.toObject();

      return res.status(201).send({
        userId,
        ...userDetails,
        role: {
          roleId,
          ...roleDetails,
        },
      });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_CREATE_USER, apiName: 'createUser', error }, 400);
    }
  };
  updateUserById = async (req: Request, res: Response) => {
    try {
      const input: IUserUpdate = req.body;

      UserUpdateValidation.parse(input);

      const user = await this.userService.getUserByUserId(input.userId);

      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'updateUserById', debugValues: { userId: input.userId } });
      }

      // email must be unique
      if (input.email) {
        const existingEmail = await this.userService.getUserByEmail(input.email);
        if (existingEmail) {
          throw new AppError(USER_MSGS.ERR.EMAIL_ALREADY_EXISTS, { msg: USER_MSGS.ERR.EMAIL_ALREADY_EXISTS, apiName: 'updateUserById', debugValues: { email: input.email } });
        }
      }

      if (input.roleId) {
        const role = await this.roleService.getRoleById(input.roleId);
        if (!role) {
          throw new AppError(USER_MSGS.ERR.ROLE_NOT_FOUND, { msg: USER_MSGS.ERR.ROLE_NOT_FOUND, apiName: 'updateUserById', debugValues: { roleId: input.roleId } });
        }
      }
      const updatedUser = await this.userService.updateUser(input);
      if (!updatedUser) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'updateUserById' });
      }
      const userObj = typeof updatedUser.toObject === 'function' ? updatedUser.toObject() : updatedUser;
      const { _id: userId, roleId: updatedRole, ...userDetails } = userObj;
      const roleObj = updatedRole && typeof updatedRole === 'object' ? updatedRole : {};
      const { _id: roleId, ...roleDetails } = roleObj as any;

      return fmtRes(res, {
        userId,
        ...userDetails,
        role: {
          roleId,
          ...roleDetails,
        },
      });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_UPDATE_USER, apiName: 'updateUserById', error }, 400);
    }
  };
  deleteUserById = async (req: Request, res: Response) => {
    try {
      const { userId } = req.params;

      UserIdValidation.parse(userId);

      const user = await this.userService.getUserByUserId(userId);

      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'deleteUserById', debugValues: { userId } });
      }

      await this.userService.deleteUserById(userId);

      const response = `User deleted successfully with user id: ${userId}`;

      console.info(response);

      return fmtRes(res, { message: response });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_DELETE_USER, apiName: 'deleteUserById', error }, 400);
    }
  };

  watchAd = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError('Unauthorized access', { apiName: 'watchAd' }, 401);
      }

      const updatedUser = await this.userService.addCoins(loggedInUserId, 10);
      if (!updatedUser) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'watchAd' });
      }

      return fmtRes(res, { coins: updatedUser.coins, message: 'You have earned 10 coins for watching an ad.' });
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Failed to earn coins by watching ad', apiName: 'watchAd', error }, error.statusCode || 400);
    }
  };

  purchaseCoins = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError('Unauthorized access', { apiName: 'purchaseCoins' }, 401);
      }

      const body = req.body;
      CreditCardPaymentValidation.parse(body);

      const result = await this.userService.purchaseCoins(loggedInUserId, body);
      return fmtRes(res, result);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to process coin purchase', apiName: 'purchaseCoins', error }, error.statusCode || 400);
    }
  };

  upgradeToPro = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError('Unauthorized access', { apiName: 'upgradeToPro' }, 401);
      }

      const body = req.body;
      CreditCardPaymentValidation.parse(body);

      const result = await this.userService.upgradeToPro(loggedInUserId, body);
      return fmtRes(res, result);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to upgrade to Forti AI Pro', apiName: 'upgradeToPro', error }, error.statusCode || 400);
    }
  };

  toggleAiOptIn = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError('Unauthorized access', { apiName: 'toggleAiOptIn' }, 401);
      }

      const body = req.body;
      ToggleAiOptInValidation.parse(body);

      const result = await this.userService.toggleAiOptIn(loggedInUserId, body.isAiOptedIn);
      return fmtRes(res, result);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to update AI opt-in status', apiName: 'toggleAiOptIn', error }, error.statusCode || 400);
    }
  };

  getTokenUsage = async (req: Request, res: Response) => {
    try {
      const loggedInUserId = req.headers.userId as string;
      if (!loggedInUserId) {
        throw new AppError('Unauthorized access', { apiName: 'getTokenUsage' }, 401);
      }

      const result = await this.userService.getTokenUsage(loggedInUserId);
      return fmtRes(res, result);
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to fetch token usage', apiName: 'getTokenUsage', error }, error.statusCode || 400);
    }
  };
}
