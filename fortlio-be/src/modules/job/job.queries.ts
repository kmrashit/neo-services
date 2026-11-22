import mongoose, { PipelineStage } from 'mongoose';
import { IJobFilter } from './job.interface';

export const getMyJobsPipeline = (hrUserId: string | mongoose.Types.ObjectId): PipelineStage[] => [
  { $match: { postedBy: new mongoose.Types.ObjectId(hrUserId) } },
  { $sort: { createdAt: -1 } },
  {
    $lookup: {
      from: 'job_applications',
      localField: '_id',
      foreignField: 'jobId',
      as: 'applications',
    },
  },
  {
    $project: {
      _id: { $toString: '$_id' },
      id: { $toString: '$_id' },
      title: 1,
      companyName: 1,
      department: 1,
      profession: 1,
      location: 1,
      workplaceType: 1,
      experienceYears: 1,
      salaryRange: 1,
      skills: 1,
      description: 1,
      status: 1,
      applicantCount: { $size: '$applications' },
      createdAt: 1,
      updatedAt: 1,
    },
  },
];

export const searchJobsPipeline = (filter: IJobFilter): PipelineStage[] => {
  const matchConditions: any[] = [{ status: 'active' }];

  if (filter.profession && filter.profession.trim() && filter.profession !== 'All') {
    matchConditions.push({ profession: new RegExp(`^${filter.profession.trim()}$`, 'i') });
  }

  if (filter.workplaceType) {
    matchConditions.push({ workplaceType: filter.workplaceType });
  }

  if (filter.minExperience && filter.minExperience > 0) {
    matchConditions.push({ experienceYears: { $lte: Number(filter.minExperience) } });
  }

  if (filter.skills && filter.skills.length > 0) {
    const skillRegexes = filter.skills.map((s) => new RegExp(s.trim(), 'i'));
    matchConditions.push({ skills: { $in: skillRegexes } });
  }

  if (filter.searchKey && filter.searchKey.trim() && filter.searchKey.trim() !== '*') {
    const regex = new RegExp(filter.searchKey.trim(), 'i');
    matchConditions.push({
      $or: [
        { title: regex },
        { companyName: regex },
        { department: regex },
        { profession: regex },
        { location: regex },
        { skills: regex },
        { description: regex },
      ],
    });
  }

  return [
    { $match: { $and: matchConditions } },
    { $sort: { createdAt: -1 } },
    {
      $lookup: {
        from: 'job_applications',
        localField: '_id',
        foreignField: 'jobId',
        as: 'applications',
      },
    },
    {
      $project: {
        _id: { $toString: '$_id' },
        id: { $toString: '$_id' },
        title: 1,
        companyName: 1,
        department: 1,
        profession: 1,
        location: 1,
        workplaceType: 1,
        experienceYears: 1,
        salaryRange: 1,
        skills: 1,
        description: 1,
        status: 1,
        applicantCount: { $size: '$applications' },
        createdAt: 1,
        updatedAt: 1,
      },
    },
  ];
};

export const getJobApplicantsPipeline = (jobId: string | mongoose.Types.ObjectId): PipelineStage[] => [
  { $match: { jobId: new mongoose.Types.ObjectId(jobId) } },
  { $sort: { appliedAt: -1 } },
  {
    $lookup: {
      from: 'users',
      localField: 'candidateId',
      foreignField: '_id',
      as: 'userDoc',
    },
  },
  { $unwind: '$userDoc' },
  {
    $lookup: {
      from: 'candidate_profiles',
      localField: 'candidateId',
      foreignField: 'userId',
      as: 'profileDoc',
    },
  },
  {
    $project: {
      _id: { $toString: '$_id' },
      applicationId: { $toString: '$_id' },
      jobId: { $toString: '$jobId' },
      candidateId: { $toString: '$candidateId' },
      status: 1,
      coverNote: 1,
      appliedAt: 1,
      candidate: {
        fullName: '$userDoc.fullName',
        email: '$userDoc.email',
        headline: { $ifNull: [{ $arrayElemAt: ['$profileDoc.headline', 0] }, ''] },
        profession: { $ifNull: [{ $arrayElemAt: ['$profileDoc.profession', 0] }, ''] },
        skills: { $ifNull: [{ $arrayElemAt: ['$profileDoc.skills', 0] }, []] },
        experience: { $ifNull: [{ $arrayElemAt: ['$profileDoc.experience', 0] }, 0] },
        location: { $ifNull: [{ $arrayElemAt: ['$profileDoc.location', 0] }, ''] },
        learningVelocityScore: { $ifNull: [{ $arrayElemAt: ['$profileDoc.learningVelocityScore', 0] }, 85] },
        bio: { $ifNull: [{ $arrayElemAt: ['$profileDoc.bio', 0] }, ''] },
      },
    },
  },
];
