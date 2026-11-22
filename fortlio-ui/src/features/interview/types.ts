export type InterviewType = 'domain_technical' | 'behavioral_leadership' | 'case_study';
export type TargetLevel = 'Junior' | 'Mid' | 'Senior' | 'Staff / Principal' | 'Executive';
export type InterviewStatus = 'in_progress' | 'completed' | 'abandoned';
export type ReadinessBadge = 'Emerging' | 'Proficient' | 'Advanced' | 'Expert / Lead';

export interface IInterviewTurn {
  questionId: string;
  questionText: string;
  answerText?: string;
  audioDurationSeconds?: number;
  askedAt: string;
  answeredAt?: string;
  feedback?: string;
}

export interface IInterviewScorecard {
  overallScore: number;
  readinessBadge: ReadinessBadge;
  domainDepthScore: number;
  problemSolvingScore: number;
  communicationScore: number;
  leadershipScore: number;
  strengths: string[];
  areasForImprovement: string[];
  summary: string;
  evaluatedAt?: string;
}

export interface IInterviewSession {
  id: string;
  _id?: string;
  candidateId: string;
  interviewType: InterviewType;
  profession: string;
  specialty: string;
  targetLevel: TargetLevel;
  status: InterviewStatus;
  currentTurn: number;
  maxTurns: number;
  turns: IInterviewTurn[];
  scorecard?: IInterviewScorecard;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
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

export interface ITurnResponseResult {
  turnCompleted: number;
  maxTurns: number;
  nextQuestion?: string;
  isComplete: boolean;
  scorecard?: IInterviewScorecard;
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
