import mongoose, { Schema } from 'mongoose';
import type { IInterviewSessionDoc } from '../interview.interface';

const TurnSchema = new Schema(
  {
    questionId: { type: String, required: true },
    questionText: { type: String, required: true },
    answerText: { type: String },
    audioDurationSeconds: { type: Number, default: 0 },
    askedAt: { type: Date, default: Date.now },
    answeredAt: { type: Date },
    feedback: { type: String },
  },
  { _id: false },
);

const ScorecardSchema = new Schema(
  {
    overallScore: { type: Number, required: true, min: 1, max: 100 },
    domainDepth: { type: Number, required: true, min: 1, max: 100 },
    problemSolving: { type: Number, required: true, min: 1, max: 100 },
    communication: { type: Number, required: true, min: 1, max: 100 },
    leadership: { type: Number, required: true, min: 1, max: 100 },
    strengths: [{ type: String }],
    improvements: [{ type: String }],
    summary: { type: String, required: true },
    readinessBadge: {
      type: String,
      enum: ['Emerging', 'Proficient', 'Advanced', 'Expert / Lead'],
      required: true,
    },
  },
  { _id: false },
);

const InterviewSessionSchema = new Schema(
  {
    candidateUserId: {
      type: Schema.Types.ObjectId,
      ref: 'users',
      required: true,
      index: true,
    },
    interviewType: {
      type: String,
      enum: ['domain_technical', 'behavioral_leadership', 'case_study'],
      required: true,
      default: 'domain_technical',
    },
    profession: {
      type: String,
      required: true,
      trim: true,
    },
    specialty: {
      type: String,
      required: true,
      trim: true,
    },
    targetLevel: {
      type: String,
      enum: ['Junior', 'Mid', 'Senior', 'Staff / Principal', 'Executive'],
      required: true,
      default: 'Mid',
    },
    status: {
      type: String,
      enum: ['in_progress', 'completed', 'abandoned'],
      default: 'in_progress',
      index: true,
    },
    turns: [TurnSchema],
    scorecard: { type: ScorecardSchema },
    isPublic: { type: Boolean, default: false },
    startedAt: { type: Date, default: Date.now },
    completedAt: { type: Date },
  },
  {
    timestamps: true,
    collection: 'interview_sessions',
  },
);

InterviewSessionSchema.index({ candidateUserId: 1, createdAt: -1 });

export const InterviewSession = mongoose.model<IInterviewSessionDoc>(
  'InterviewSession',
  InterviewSessionSchema,
);
export default InterviewSession;
