import mongoose from 'mongoose';

export const findHrProfileByUserIdQuery = (userId: string | mongoose.Types.ObjectId) => ({
  userId: new mongoose.Types.ObjectId(userId),
});

export const getRecentProfileViewsQuery = (userId: string | mongoose.Types.ObjectId, _limit = 10) => ({
  userId: new mongoose.Types.ObjectId(userId),
});

export const getSearchHistoryQuery = (userId: string | mongoose.Types.ObjectId, _limit = 10) => ({
  userId: new mongoose.Types.ObjectId(userId),
});
