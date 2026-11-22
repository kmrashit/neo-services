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

export const searchCandidatesMongoPipeline = (
  searchKey?: string,
  minExperience?: number,
  skills?: string[],
): PipelineStage[] => {
  const matchConditions: any[] = [];

  if (minExperience && minExperience > 0) {
    matchConditions.push({ experience: { $gte: Number(minExperience) } });
  }

  if (skills && skills.length > 0) {
    const skillRegexes = skills.map((s) => new RegExp(s.trim(), 'i'));
    matchConditions.push({ skills: { $in: skillRegexes } });
  }

  const pipeline: PipelineStage[] = [];

  if (matchConditions.length > 0) {
    pipeline.push({ $match: { $and: matchConditions } });
  }

  pipeline.push(
    {
      $lookup: {
        from: 'users',
        localField: 'userId',
        foreignField: '_id',
        as: 'userDoc',
      },
    },
    { $unwind: '$userDoc' },
    {
      $project: {
        _id: { $toString: '$_id' },
        id: { $toString: '$_id' },
        userId: { $toString: '$userId' },
        fullName: '$userDoc.fullName',
        email: '$userDoc.email',
        mobileNumber: 1,
        skills: { $ifNull: ['$skills', []] },
        profession: { $ifNull: ['$profession', 'Professional'] },
        headline: { $ifNull: ['$headline', ''] },
        bio: { $ifNull: ['$bio', ''] },
        experience: { $ifNull: ['$experience', 0] },
        location: { $ifNull: ['$location', 'Remote'] },
        learningVelocityScore: { $ifNull: ['$learningVelocityScore', 85] },
        leadershipTags: { $ifNull: ['$leadershipTags', []] },
        topics: { $ifNull: ['$topics', []] },
      },
    },
  );

  if (searchKey && searchKey.trim() && searchKey.trim() !== '*') {
    const regex = new RegExp(searchKey.trim(), 'i');
    pipeline.push({
      $match: {
        $or: [
          { fullName: regex },
          { email: regex },
          { headline: regex },
          { profession: regex },
          { bio: regex },
          { skills: regex },
          { location: regex },
        ],
      },
    });
  }

  return pipeline;
};

