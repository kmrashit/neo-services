import { PipelineStage } from 'mongoose';
import { ICodeLang } from './leetcode.interface';

export const getQuestAnsPipeline = (slug: string, codeLang: ICodeLang): PipelineStage[] => [
  { $match: { titleSlug: slug } },
  {
    $lookup: {
      from: 'dsa-answers',
      let: { qId: '$questionId' },
      pipeline: [{ $match: { $expr: { $and: [{ $eq: ['$questionId', '$$qId'] }, { $eq: ['$codeLang', codeLang] }] } } }],
      as: 'answers',
    },
  },
  { $unwind: { path: '$answers', preserveNullAndEmptyArrays: true } },
  {
    $project: {
      questionId: '$questionId',
      titleSlug: '$titleSlug',
      content: '$content',
      codeLang: '$answers.codeLang',
      llmRes: '$answers.llmRes',
      difficulty: '$difficulty',
      questionTitle: '$questionTitle',
    },
  },
  { $limit: 1 },
];

export const getQuestByIdsPipeline = (ids: string[]): PipelineStage[] => [
  { $match: { questionId: { $in: ids } } },
];
