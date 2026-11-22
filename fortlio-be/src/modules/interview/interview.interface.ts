import { Types } from 'mongoose';

export type InterviewType = 'domain_technical' | 'behavioral_leadership' | 'case_study';
export type TargetLevel = 'Junior' | 'Mid' | 'Senior' | 'Staff / Principal' | 'Executive';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';
export type ReadinessBadge = 'Emerging' | 'Proficient' | 'Advanced' | 'Expert / Lead';

export interface IInterviewTurn {
  questionId: string;
  questionText: string;
  answerText?: string;
  audioDurationSeconds?: number;
  askedAt: Date;
  answeredAt?: Date;
  feedback?: string;
}

export interface IInterviewScorecard {
  overallScore: number;
  domainDepth: number;
  problemSolving: number;
  communication: number;
  leadership: number;
  strengths: string[];
  improvements: string[];
  summary: string;
  readinessBadge: ReadinessBadge;
}

export interface IInterviewSessionDoc extends Document {
  candidateUserId: Types.ObjectId;
  interviewType: InterviewType;
  profession: string;
  specialty: string;
  targetLevel: TargetLevel;
  status: InterviewStatus;
  turns: IInterviewTurn[];
  scorecard?: IInterviewScorecard;
  isPublic: boolean;
  startedAt: Date;
  completedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IStartInterviewPayload {
  interviewType?: InterviewType;
  profession: string;
  specialty: string;
  targetLevel?: TargetLevel;
}

export interface ISubmitResponsePayload {
  answerText: string;
  audioDurationSeconds?: number;
}
