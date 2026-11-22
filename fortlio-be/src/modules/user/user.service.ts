import { getDataWithLookupsAfterFilter, dispatchUserCommunication } from '../../core/core-helper';
import User from './models/user.model';
import { IUserCreate, IUserUpdate } from '../../interface/user-interface';
import { IFilter } from '../../interface/common.interface';
import { AppError } from '../../core/core-utils/err-util';
import * as USER_MSGS from './user.constants';
import { userRoleLookupPipeline, getUserByIdPipeline } from './user.queries';

export class UserService {
  async getUsers(filterQuery: IFilter) {
    try {
      const searchFields = ['fullName', 'lastName', 'mobileNumber', 'email'];

      return await getDataWithLookupsAfterFilter(filterQuery, [], userRoleLookupPipeline, searchFields, User);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_FETCH_USERS, apiName: 'getUsers' });
    }
  }
  async getUserByUserId(userId: string) {
    try {
      const pipeline = getUserByIdPipeline(userId);

      const result = await User.aggregate(pipeline).exec();

      if (!result?.length) {
        return null;
      }

      return result[0];
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_FETCH_USER_BY_USER_ID, apiName: 'getUserByUserId', debugValues: { userId } });
    }
  }
  async getUserByEmail(email: string) {
    try {
      const user = await User.findOne({ email }).populate('roleId');
      return user;
    }
    catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_FETCH_USER_BY_EMAIL, apiName: 'getUserByEmail', debugValues: { email } });
    }
  }
  async createUser(userDetails: IUserCreate) {
    try {
      const user = new User(userDetails);

      await user.save();
      return user;
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_CREATE_USER, apiName: 'createUser', debugValues: { userDetails } });
    }
  }

  async updateUser(userDetails: IUserUpdate) {
    try {
      return await User.findByIdAndUpdate(userDetails.userId, { ...userDetails }, { new: true }).populate('roleId');
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_UPDATE_USER, apiName: 'updateUser', debugValues: { userDetails } });
    }
  }

  async updateUserByUserId(userId: string, status: boolean) {
    try {
      return await User.findByIdAndUpdate(userId, { status }, { new: true }).populate('roleId');
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_UPDATE_USER, apiName: 'updateUserByUserId', debugValues: { userId, status } });
    }
  }

  async deleteUserById(userId: string) {
    try {
      return await User.findByIdAndDelete(userId);
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: USER_MSGS.ERR.FAILED_TO_DELETE_USER, apiName: 'deleteUserById', debugValues: { userId } });
    }
  }

  async addCoins(userId: string, amount: number) {
    try {
      return await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: Math.abs(amount) } },
        { new: true },
      ).exec();
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Failed to add coins to user', apiName: 'addCoins', debugValues: { userId, amount } });
    }
  }

  async deductCoins(userId: string, amount: number) {
    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'deductCoins' });
      }

      const currentCoins = user.coins || 0;
      if (currentCoins < amount) {
        throw new AppError('Insufficient coins', { msg: 'Insufficient coins', apiName: 'deductCoins', debugValues: { userId, currentCoins, amount } }, 402);
      }

      return await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: -(Math.abs(amount)) } },
        { new: true },
      ).exec();
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to deduct coins from user', apiName: 'deductCoins', debugValues: { userId, amount } });
    }
  }

  async purchaseCoins(userId: string, data: { cardNumber: string; amountPaid: number; coins?: number; cardholderName: string }) {
    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'purchaseCoins' });
      }

      const coinsToAdd = data.coins && data.coins > 0 ? data.coins : Math.round(data.amountPaid * 10);
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { $inc: { coins: coinsToAdd } },
        { new: true },
      ).exec();

      await dispatchUserCommunication({
        userId,
        email: user.email,
        title: 'Coins Purchased Successfully',
        message: `Your payment of $${data.amountPaid} was processed successfully. ${coinsToAdd} coins have been added to your balance. Your total balance is now ${updatedUser?.coins ?? 0} coins.`,
        type: 'BILLING',
        metadata: { coinsToAdd, amountPaid: data.amountPaid, last4: data.cardNumber.slice(-4) },
      });

      return {
        coins: updatedUser?.coins ?? 0,
        coinsAdded: coinsToAdd,
        message: `Successfully purchased ${coinsToAdd} coins via credit card ending in ${data.cardNumber.slice(-4)}.`,
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to purchase coins', apiName: 'purchaseCoins', error }, 400);
    }
  }

  async upgradeToPro(userId: string, data: { cardNumber: string; amountPaid: number; plan?: string; cardholderName: string }) {
    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'upgradeToPro' });
      }

      const bonusCoins = 500;
      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          isPro: true,
          isAiOptedIn: true,
          $inc: { coins: bonusCoins },
        },
        { new: true },
      ).exec();

      await dispatchUserCommunication({
        userId,
        email: user.email,
        title: 'Welcome to Forti AI Pro!',
        message: `Congratulations! Your Forti AI Pro membership has been activated. You now have unlimited authentic insight evaluations, green AI LED indicators, and ${bonusCoins} bonus coins credited to your account.`,
        type: 'BILLING',
        metadata: { isPro: true, plan: data.plan || 'pro_monthly', last4: data.cardNumber.slice(-4) },
      });

      return {
        isPro: true,
        isAiOptedIn: true,
        coins: updatedUser?.coins ?? 0,
        message: `Successfully upgraded to Forti AI Pro via credit card ending in ${data.cardNumber.slice(-4)}.`,
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to upgrade to Pro', apiName: 'upgradeToPro', error }, 400);
    }
  }

  async toggleAiOptIn(userId: string, isAiOptedIn: boolean) {
    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'toggleAiOptIn' });
      }

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        { isAiOptedIn },
        { new: true },
      ).exec();

      await dispatchUserCommunication({
        userId,
        email: user.email,
        title: `Forti AI Engine ${isAiOptedIn ? 'Activated' : 'Paused'}`,
        message: `Your Forti AI Engine status has been updated to: ${isAiOptedIn ? 'Active (Green LED Opted-In)' : 'Paused'}.`,
        type: 'AI_ENGINE',
        metadata: { isAiOptedIn },
      });

      return {
        isAiOptedIn: updatedUser?.isAiOptedIn ?? isAiOptedIn,
        message: `Forti AI Engine status updated to ${isAiOptedIn ? 'active' : 'inactive'}.`,
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to toggle AI engine status', apiName: 'toggleAiOptIn', error }, 400);
    }
  }

  async recordTokenUsageAndDeductCoins(userId: string, tokens: number) {
    try {
      const safeTokens = Math.max(1, Math.round(tokens));
      const coinsToDeduct = Math.max(1, Math.ceil(safeTokens / 100));

      const updatedUser = await User.findByIdAndUpdate(
        userId,
        {
          $inc: {
            tokensUsed: safeTokens,
            coins: -coinsToDeduct,
          },
        },
        { new: true },
      ).exec();

      return {
        tokensUsed: updatedUser?.tokensUsed ?? safeTokens,
        coinsDeducted: coinsToDeduct,
        remainingCoins: updatedUser?.coins ?? 0,
      };
    } catch (error: any) {
      console.warn('Failed to record token usage:', error.message || error);
      return { tokensUsed: tokens, coinsDeducted: 1, remainingCoins: 0 };
    }
  }

  async getTokenUsage(userId: string) {
    try {
      const user = await User.findById(userId).exec();
      if (!user) {
        throw new AppError(USER_MSGS.ERR.USER_NOT_FOUND, { msg: USER_MSGS.ERR.USER_NOT_FOUND, apiName: 'getTokenUsage' });
      }

      return {
        userId: user._id,
        tokensUsed: user.tokensUsed || 0,
        coins: user.coins || 0,
        isPro: Boolean(user.isPro),
        isAiOptedIn: Boolean(user.isAiOptedIn),
      };
    } catch (error: any) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError(error.message || 'unknown', { msg: 'Failed to fetch token usage', apiName: 'getTokenUsage', error }, 400);
    }
  }
}
