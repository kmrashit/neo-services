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
