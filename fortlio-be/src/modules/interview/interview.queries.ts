import mongoose, { PipelineStage } from 'mongoose';

export const getMyInterviewsBasePipeline = (
  candidateUserId: mongoose.Types.ObjectId,
): PipelineStage[] => [
  { $match: { candidateUserId } },
];

export const interviewCandidateLookupPipeline: PipelineStage[] = [
  {
    $lookup: {
      from: 'users',
      localField: 'candidateUserId',
      foreignField: '_id',
      as: 'candidateUser',
      pipeline: [{ $project: { fullName: 1, email: 1 } }],
    },
  },
  { $unwind: { path: '$candidateUser', preserveNullAndEmptyArrays: true } },
  {
    $lookup: {
      from: 'candidate_profiles',
      localField: 'candidateUserId',
      foreignField: 'userId',
      as: 'candidateProfile',
      pipeline: [{ $project: { headline: 1, profession: 1, skills: 1 } }],
    },
  },
  { $unwind: { path: '$candidateProfile', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      _id: 1,
      candidateUserId: 1,
      interviewType: 1,
      profession: 1,
      specialty: 1,
      targetLevel: 1,
      status: 1,
      scorecard: 1,
      isPublic: 1,
      startedAt: 1,
      completedAt: 1,
      createdAt: 1,
      updatedAt: 1,
      turnCount: { $size: { $ifNull: ['$turns', []] } },
      candidate: {
        fullName: '$candidateUser.fullName',
        email: '$candidateUser.email',
        headline: '$candidateProfile.headline',
        profession: '$candidateProfile.profession',
      },
    },
  },
];
