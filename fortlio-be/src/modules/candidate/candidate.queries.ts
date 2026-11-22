import mongoose, { PipelineStage } from 'mongoose';

export const getCandidateBlogsPipeline = (filterUserId?: string): PipelineStage[] => {
  const basePipeline: PipelineStage[] = [];
  if (filterUserId) {
    basePipeline.push({ $match: { candidateId: new mongoose.Types.ObjectId(filterUserId) } });
  }
  return basePipeline;
};

export const candidateBlogAuthorLookupPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'users',
      localField: 'candidateId',
      foreignField: '_id',
      as: 'author',
    },
  },
  {
    $unwind: {
      path: '$author',
      preserveNullAndEmptyArrays: true,
    },
  },
  {
    $project: {
      'author.password': 0,
      'author.__v': 0,
    },
  },
];

export const getCandidateProfileByUserIdPipeline = (userId: string | mongoose.Types.ObjectId): PipelineStage[] => {
  const matchUserId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  return [
    { $match: { userId: matchUserId } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId',
      },
    },
    {
      $unwind: {
        path: '$userId',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'userId.password': 0,
        'userId.__v': 0,
      },
    },
  ];
};

export const getCandidateProfileByIdPipeline = (profileId: string | mongoose.Types.ObjectId): PipelineStage[] => {
  const matchId = mongoose.Types.ObjectId.isValid(profileId) ? new mongoose.Types.ObjectId(profileId) : profileId;
  return [
    { $match: { _id: matchId } },
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userId',
      },
    },
    {
      $unwind: {
        path: '$userId',
        preserveNullAndEmptyArrays: true,
      },
    },
    {
      $project: {
        'userId.password': 0,
        'userId.__v': 0,
      },
    },
  ];
};

export const getUserWithRolePipeline = (userId: string | mongoose.Types.ObjectId): PipelineStage[] => {
  const matchId = mongoose.Types.ObjectId.isValid(userId) ? new mongoose.Types.ObjectId(userId) : userId;
  return [
    { $match: { _id: matchId } },
    {
      $lookup: {
        from: 'roles',
        localField: 'roleId',
        foreignField: '_id',
        as: 'roleId',
      },
    },
    {
      $unwind: {
        path: '$roleId',
        preserveNullAndEmptyArrays: true,
      },
    },
  ];
};
