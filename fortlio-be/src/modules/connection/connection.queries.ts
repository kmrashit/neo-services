import mongoose, { PipelineStage } from 'mongoose';

export const getChatHistoryPipeline = (
  connectionObjectId: mongoose.Types.ObjectId,
  senderId: mongoose.Types.ObjectId,
  receiverId: mongoose.Types.ObjectId,
  skip: number,
  limit: number,
): PipelineStage[] => [
  { $match: { connectionId: connectionObjectId, $or: [{ senderId: senderId, receiverId: receiverId }, { senderId: receiverId, receiverId: senderId }] } },
  { $sort: { createdAt: -1 as const } },
  {
    $facet: {
      data: [{ $skip: skip }, { $limit: limit }],
      totalCount: [{ $count: 'count' }],
    },
  },
];
