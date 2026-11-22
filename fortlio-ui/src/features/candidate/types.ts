export interface ISkill {
  name: string;
  category?: string;
  level?: 'beginner' | 'intermediate' | 'advanced' | 'expert';
}

export interface IExperience {
  role: string;
  company: string;
  period: string;
  description: string;
}

export interface IEducation {
  degree: string;
  institution: string;
  year: string;
}

export interface IBlogSummary {
  title: string;
  date?: string;
  readTime?: string;
  tags?: string[];
  slug?: string;
}

export interface IFortiAiInsights {
  velocityScore?: number;
  progressionRate?: string;
  depthLevel?: string;
  diversityScore?: string;
  leadershipTraits?: string[];
  primaryDomains?: string[];
}

export interface ICandidateProfile {
  id?: string;
  _id?: string;
  userId: string;
  fullName: string;
  headline?: string;
  profession?: string;
  industry?: string;
  educationLevel?: string;
  email: string;
  mobileNumber?: string;
  location?: string;
  bio?: string;
  experienceYears?: number;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  social?: {
    github?: string;
    linkedin?: string;
    website?: string;
  };
  experiences?: IExperience[];
  education?: IEducation[];
  blogs?: IBlogSummary[];
  fortiAiInsights?: IFortiAiInsights;
  updatedAt?: string;
  createdAt?: string;
}

export interface CandidateProfileUpsertPayload {
  fullName: string;
  email: string;
  mobileNumber?: string;
  skills?: string[];
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl?: string;
  experience?: number;
  bio?: string;
  [key: string]: any;
}

export interface MdToPdfPayload {
  content: string;
  settings?: Record<string, any>;
  s3Options?: {
    storeInS3?: boolean;
    bucketName?: string;
    fileName?: string;
    expiresIn?: number;
  };
}

export interface IResumeOcrResult {
  fullName?: string;
  email?: string;
  mobileNumber?: string;
  skills?: string[];
  experience?: number;
  bio?: string;
  githubUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  markdownResume?: string;
  authenticInputNote?: string;
  userId?: string;
}

export interface CandidateApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
