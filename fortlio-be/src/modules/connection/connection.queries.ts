import mongoose, { PipelineStage, FilterQuery } from 'mongoose';

export const getListConnectionsPipeline = (
  userObjectId: mongoose.Types.ObjectId,
  status?: string,
): PipelineStage[] => {
  const matchStage: FilterQuery<any> = {
    $or: [{ senderId: userObjectId }, { receiverId: userObjectId }],
  };
  if (status && status !== 'all') {
    matchStage.status = status;
  }

  return [
    { $match: matchStage },
    { $sort: { updatedAt: -1 } },
    {
      $lookup: {
        from: 'users',
        localField: 'senderId',
        foreignField: '_id',
        as: 'senderUser',
        pipeline: [{ $project: { fullName: 1, email: 1, roleId: 1 } }],
      },
    },
    { $unwind: { path: '$senderUser', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'users',
        localField: 'receiverId',
        foreignField: '_id',
        as: 'receiverUser',
        pipeline: [{ $project: { fullName: 1, email: 1, roleId: 1 } }],
      },
    },
    { $unwind: { path: '$receiverUser', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'candidate_profiles',
        localField: 'senderId',
        foreignField: 'userId',
        as: 'senderCandidate',
        pipeline: [{ $project: { headline: 1, profession: 1, skills: 1 } }],
      },
    },
    { $unwind: { path: '$senderCandidate', preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: 'candidate_profiles',
        localField: 'receiverId',
        foreignField: 'userId',
        as: 'receiverCandidate',
        pipeline: [{ $project: { headline: 1, profession: 1, skills: 1 } }],
      },
    },
    { $unwind: { path: '$receiverCandidate', preserveNullAndEmptyArrays: true } },
    {
      $project: {
        _id: 1,
        status: 1,
        message: 1,
        createdAt: 1,
        updatedAt: 1,
        senderId: {
          _id: '$senderId',
          fullName: '$senderUser.fullName',
          email: '$senderUser.email',
          headline: '$senderCandidate.headline',
          profession: '$senderCandidate.profession',
          skills: '$senderCandidate.skills',
        },
        receiverId: {
          _id: '$receiverId',
          fullName: '$receiverUser.fullName',
          email: '$receiverUser.email',
          headline: '$receiverCandidate.headline',
          profession: '$receiverCandidate.profession',
          skills: '$receiverCandidate.skills',
        },
      },
    },
  ];
};

export const getListNotificationsPipeline = (
  userObjectId: mongoose.Types.ObjectId,
): PipelineStage[] => [
  { $match: { userId: userObjectId } },
  { $sort: { createdAt: -1 } },
  { $limit: 50 },
];

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
