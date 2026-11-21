export interface ILearningVelocity {
  score: number;
  summary: string;
  progressionRate: 'rapid' | 'steady' | 'exploratory';
}

export interface IKnowledgeVolume {
  articleCount: number;
  depthLevel: 'introductory' | 'intermediate' | 'advanced' | 'expert';
}

export interface ITopicDiversity {
  primaryDomains: string[];
  exploredTopics: string[];
  diversityScore: number;
}

export interface IDetectedQualities {
  leadership: string[];
  mindset: string[];
}

export interface ICandidateInsights {
  _id?: string;
  candidateId: string;
  learningVelocity: ILearningVelocity;
  knowledgeVolume: IKnowledgeVolume;
  topicDiversity: ITopicDiversity;
  detectedQualities: IDetectedQualities;
  rawAiSummary: string;
  lastSynthesizedBlogId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface IChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

export interface FortiApiResponse<T = any> {
  success: boolean;
  data: T;
  message?: string;
}
