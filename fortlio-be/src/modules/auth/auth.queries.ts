import mongoose, { PipelineStage } from 'mongoose';

export const findUserPrivateByUserIdQuery = (userId: string | mongoose.Types.ObjectId) => ({
  userId: new mongoose.Types.ObjectId(userId),
});

export const findUserPrivateByTokenHashQuery = (tokenHash: string) => ({
  verificationTokenHash: tokenHash,
});

export const findUserPrivateByRefreshTokenHashQuery = (refreshTokenHash: string) => ({
  refreshTokenHash,
});

export const getUserLoginAggregationPipeline = (normalizedEmail: string): PipelineStage[] => [
  { $match: { email: normalizedEmail } },
  {
    $lookup: {
      from: 'user-privates',
      localField: '_id',
      foreignField: 'userId',
      as: 'userPrivate',
    },
  },
  {
    $unwind: {
      path: '$userPrivate',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $lookup: {
      from: 'roles',
      localField: 'roleId',
      foreignField: '_id',
      as: 'role',
    },
  },
  {
    $unwind: {
      path: '$role',
      preserveNullAndEmptyArrays: true,
    },
  },
];

