import mongoose from 'mongoose';

export const getCandidateInsightsPipeline = (candidateId: mongoose.Types.ObjectId) => [
  { $match: { candidateId } },
  {
    $project: {
      _id: 1,
      candidateId: 1,
      learningVelocity: 1,
      knowledgeVolume: 1,
      topicDiversity: 1,
      detectedQualities: 1,
      rawAiSummary: 1,
      lastSynthesizedBlogId: 1,
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const getCandidatePortfolioContextPipeline = (userId: mongoose.Types.ObjectId) => [
  { $match: { userId } },
  {
    $lookup: {
      from: 'candidate_blogs',
      localField: 'userId',
      foreignField: 'candidateId',
      as: 'blogs',
    },
  },
  {
    $lookup: {
      from: 'candidate_insights',
      localField: '_id',
      foreignField: 'candidateId',
      as: 'insights',
    },
  },
  {
    $project: {
      _id: 1,
      userId: 1,
      fullName: 1,
      headline: 1,
      profession: 1,
      industry: 1,
      bio: 1,
      skills: 1,
      experiences: 1,
      education: 1,
      blogs: {
        $map: {
          input: '$blogs',
          as: 'b',
          in: {
            title: '$$b.title',
            content: { $substrCP: ['$$b.content', 0, 800] },
            tags: '$$b.blogKeywords',
            status: '$$b.status',
          },
        },
      },
      insights: { $arrayElemAt: ['$insights', 0] },
    },
  },
];
