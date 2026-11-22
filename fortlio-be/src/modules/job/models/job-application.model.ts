import mongoose, { Schema, Document } from 'mongoose';

export interface IJobApplicationDoc extends Document {
  jobId: mongoose.Types.ObjectId;
  candidateId: mongoose.Types.ObjectId;
  status: 'applied' | 'reviewing' | 'shortlisted' | 'rejected';
  coverNote?: string;
  appliedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const jobApplicationSchema = new Schema<IJobApplicationDoc>(
  {
    jobId: { type: Schema.Types.ObjectId, ref: 'job', required: true, index: true },
    candidateId: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    status: {
      type: String,
      enum: ['applied', 'reviewing', 'shortlisted', 'rejected'],
      default: 'applied',
      index: true,
    },
    coverNote: { type: String, default: '', trim: true },
    appliedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  },
);

// Prevent duplicate application from same candidate to same job
jobApplicationSchema.index({ jobId: 1, candidateId: 1 }, { unique: true });

const JobApplication = mongoose.model<IJobApplicationDoc>('job_application', jobApplicationSchema);

export default JobApplication;
