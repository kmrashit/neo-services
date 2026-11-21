import mongoose from 'mongoose';

export const findUrlByShortCodeQuery = (shortCode: string) => ({
  shortCode,
});

export const getLinkAnalyticsPipeline = (shortCode: string) => [
  { $match: { shortCode } },
  {
    $project: {
      shortCode: 1,
      originalUrl: 1,
      targetType: 1,
      targetId: 1,
      accessCount: 1,
      viewsCount: { $ifNull: ['$viewsCount', '$accessCount'] },
      totalTimeSpentSeconds: { $ifNull: ['$totalTimeSpentSeconds', 0] },
      averageTimeSpentSeconds: {
        $cond: [
          { $gt: [{ $ifNull: ['$viewsCount', '$accessCount'] }, 0] },
          {
            $round: [
              {
                $divide: [
                  { $ifNull: ['$totalTimeSpentSeconds', 0] },
                  { $ifNull: ['$viewsCount', '$accessCount'] },
                ],
              },
              1,
            ],
          },
          0,
        ],
      },
      createdBy: 1,
      lastAccessedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const getMyLinksPipeline = (userId: mongoose.Types.ObjectId) => [
  { $match: { createdBy: userId } },
  { $sort: { createdAt: -1 as const } },
  {
    $project: {
      shortCode: 1,
      originalUrl: 1,
      targetType: 1,
      targetId: 1,
      accessCount: 1,
      viewsCount: { $ifNull: ['$viewsCount', '$accessCount'] },
      totalTimeSpentSeconds: { $ifNull: ['$totalTimeSpentSeconds', 0] },
      averageTimeSpentSeconds: {
        $cond: [
          { $gt: [{ $ifNull: ['$viewsCount', '$accessCount'] }, 0] },
          {
            $round: [
              {
                $divide: [
                  { $ifNull: ['$totalTimeSpentSeconds', 0] },
                  { $ifNull: ['$viewsCount', '$accessCount'] },
                ],
              },
              1,
            ],
          },
          0,
        ],
      },
      lastAccessedAt: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];
