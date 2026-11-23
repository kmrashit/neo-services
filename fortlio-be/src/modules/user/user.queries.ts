import mongoose, { PipelineStage } from 'mongoose';

export const userRoleLookupPipeline: PipelineStage[] = [
  { $lookup: { from: 'roles', localField: 'roleId', foreignField: '_id', as: 'role' } },
  { $unwind: { path: '$role', preserveNullAndEmptyArrays: true } },
  { $addFields: { userId: '$_id', 'role.roleId': '$role._id' } },
  {
    $project: {
      rolePrivileges: 0,
      password: 0,
      __v: 0,
    },
  },
];

export const getUsersPipeline: PipelineStage[] = [
  ...userRoleLookupPipeline,
];

export const getUserByIdPipeline = (userId: string | mongoose.Types.ObjectId): PipelineStage[] => {
  const matchId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  return [
    { $match: { _id: matchId } },
    ...userRoleLookupPipeline,
  ];
};
