import mongoose from 'mongoose';
import { ICandidateDoc } from '../candidate.interface';

const candidateSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true, unique: true, index: true },
    mobileNumber: { type: String, default: '' },
    skills: { type: [String], default: [] },
    githubUrl: { type: String, default: '' },
    linkedinUrl: { type: String, default: '' },
    portfolioUrl: { type: String, default: '' },
    resumeUrl: { type: String, default: '' },
    experience: { type: Number, default: 0 },
    bio: { type: String, default: '' },
    headline: { type: String, default: '' },
    profession: { type: String, default: 'Engineering & Technology' },
    location: { type: String, default: 'Remote' },
    learningVelocityScore: { type: Number, default: 85 },
    leadershipTags: { type: [String], default: [] },
    topics: { type: [String], default: [] },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

candidateSchema.virtual('candidateId').get(function () {
  return this._id;
});

const CandidateProfile = mongoose.model<ICandidateDoc>('candidate_profile', candidateSchema);

export default CandidateProfile;
