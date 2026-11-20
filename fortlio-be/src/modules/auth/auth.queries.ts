import mongoose from 'mongoose';

export const findUserPrivateByUserIdQuery = (userId: string | mongoose.Types.ObjectId) => ({
  userId: new mongoose.Types.ObjectId(userId),
});

export const findUserPrivateByTokenHashQuery = (tokenHash: string) => ({
  verificationTokenHash: tokenHash,
});

export const findUserPrivateByRefreshTokenHashQuery = (refreshTokenHash: string) => ({
  refreshTokenHash,
});
