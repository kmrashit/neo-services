import mongoose from 'mongoose';

const candidateInsightSchema = new mongoose.Schema(
  {
    candidateId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CandidateProfile',
      required: true,
      unique: true,
      index: true,
    },
    learningVelocity: {
      score: { type: Number, default: 92, min: 1, max: 100 },
      summary: {
        type: String,
        default: 'Demonstrates rapid conceptual velocity across domain-specific architectures and authentic problem solving.',
      },
      progressionRate: {
        type: String,
        enum: ['rapid', 'steady', 'exploratory'],
        default: 'rapid',
      },
    },
    knowledgeVolume: {
      articleCount: { type: Number, default: 1 },
      depthLevel: {
        type: String,
        enum: ['introductory', 'intermediate', 'advanced', 'expert'],
        default: 'advanced',
      },
    },
    topicDiversity: {
      primaryDomains: [{ type: String }],
      exploredTopics: [{ type: String }],
      diversityScore: { type: Number, default: 9.2, min: 1, max: 10 },
    },
    detectedQualities: {
      leadership: [{ type: String }],
      mindset: [{ type: String }],
    },
    rawAiSummary: {
      type: String,
      default: 'Synthesized talent profile demonstrates deep domain mastery, rigorous critical thinking, and strong cross-functional communication.',
    },
    lastSynthesizedBlogId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'candidate_blogs',
      default: null,
    },
  },
  { timestamps: { createdAt: 'createdAt', updatedAt: 'updatedAt' } },
);

const CandidateInsight = mongoose.model('candidate_insights', candidateInsightSchema);

export default CandidateInsight;
