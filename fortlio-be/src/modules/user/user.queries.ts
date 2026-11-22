import mongoose, { PipelineStage } from 'mongoose';

export const userRoleLookupPipeline: PipelineStage[] = [
  { $lookup: { from: 'roles', localField: 'roleId', foreignField: '_id', as: 'role' } },
  { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
  { $addFields: { userId: '$_id', 'role.roleId': '$role._id' } },
];

export const getUsersPipeline: PipelineStage[] = [
  ...userRoleLookupPipeline,
];

export const getUserByIdPipeline = (userId: string | mongoose.Types.ObjectId): PipelineStage[] => [
  { $match: { _id: new mongoose.Types.ObjectId(userId) } },
  ...userRoleLookupPipeline,
];
