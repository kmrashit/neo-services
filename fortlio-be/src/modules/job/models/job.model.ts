import mongoose, { Schema, Document } from 'mongoose';

export interface IJobDoc extends Document {
  title: string;
  companyName: string;
  department: string;
  profession: string;
  location: string;
  workplaceType: 'Remote' | 'Hybrid' | 'Onsite';
  experienceYears: number;
  salaryRange: string;
  skills: string[];
  description: string;
  postedBy: mongoose.Types.ObjectId;
  status: 'active' | 'closed' | 'draft';
  createdAt: Date;
  updatedAt: Date;
}

const jobSchema = new Schema<IJobDoc>(
  {
    title: { type: String, required: true, trim: true },
    companyName: { type: String, required: true, trim: true },
    department: { type: String, default: 'General', trim: true },
    profession: { type: String, required: true, trim: true },
    location: { type: String, default: 'Remote', trim: true },
    workplaceType: { type: String, enum: ['Remote', 'Hybrid', 'Onsite'], default: 'Remote' },
    experienceYears: { type: Number, default: 0 },
    salaryRange: { type: String, default: 'Competitive', trim: true },
    skills: { type: [String], default: [] },
    description: { type: String, default: '', trim: true },
    postedBy: { type: Schema.Types.ObjectId, ref: 'user', required: true, index: true },
    status: { type: String, enum: ['active', 'closed', 'draft'], default: 'active', index: true },
  },
  {
    timestamps: true,
  },
);

const Job = mongoose.model<IJobDoc>('job', jobSchema);

export default Job;
