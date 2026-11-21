import mongoose, { PipelineStage } from 'mongoose';

export const findHrProfileByUserIdQuery = (userId: string | mongoose.Types.ObjectId) => ({
  userId: new mongoose.Types.ObjectId(userId),
});

export const getViewedProfilesPipeline = (
  userId: mongoose.Types.ObjectId,
  limit = 10,
): PipelineStage[] => [
  { $match: { userId } },
  { $sort: { viewedAt: -1 } },
  { $limit: limit },
  {
    $lookup: {
      from: 'candidate_profiles',
      localField: 'viewedUserId',
      foreignField: 'userId',
      as: 'candidateDoc',
    },
  },
  {
    $lookup: {
      from: 'hr_profiles',
      localField: 'viewedUserId',
      foreignField: 'userId',
      as: 'hrDoc',
    },
  },
  {
    $lookup: {
      from: 'users',
      localField: 'viewedUserId',
      foreignField: '_id',
      as: 'userDoc',
    },
  },
  {
    $project: {
      viewedUserId: { $toString: '$viewedUserId' },
      viewedAt: 1,
      profile: {
        $let: {
          vars: {
            cand: { $arrayElemAt: ['$candidateDoc', 0] },
            hr: { $arrayElemAt: ['$hrDoc', 0] },
            usr: { $arrayElemAt: ['$userDoc', 0] },
          },
          in: {
            $cond: {
              if: { $ne: ['$$cand', null] },
              then: {
                $mergeObjects: [
                  '$$cand',
                  {
                    fullName: '$$usr.fullName',
                    email: '$$usr.email',
                    userId: { $toString: '$$cand.userId' },
                  },
                ],
              },
              else: {
                $cond: {
                  if: { $ne: ['$$hr', null] },
                  then: {
                    $mergeObjects: [
                      '$$hr',
                      {
                        fullName: '$$usr.fullName',
                        email: '$$usr.email',
                        userId: { $toString: '$$hr.userId' },
                      },
                    ],
                  },
                  else: null,
                },
              },
            },
          },
        },
      },
    },
  },
];

export const getSearchHistoryPipeline = (
  userId: mongoose.Types.ObjectId,
  limit = 10,
): PipelineStage[] => [
  { $match: { userId } },
  { $sort: { searchedAt: -1 } },
  { $limit: limit },
  {
    $project: {
      _id: { $toString: '$_id' },
      userId: { $toString: '$userId' },
      query: 1,
      filters: 1,
      searchedAt: 1,
    },
  },
];

