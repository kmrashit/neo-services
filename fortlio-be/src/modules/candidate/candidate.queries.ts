import mongoose, { PipelineStage } from 'mongoose';

export const getCandidateBlogsPipeline = (filterUserId?: string): PipelineStage[] => {
  const basePipeline: PipelineStage[] = [];
  if (filterUserId) {
    basePipeline.push({ $match: { candidateId: new mongoose.Types.ObjectId(filterUserId) } });
  }
  return basePipeline;
};
