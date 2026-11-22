export type WorkplaceType = 'Remote' | 'Hybrid' | 'Onsite';
export type JobStatus = 'active' | 'closed' | 'draft';
export type ApplicationStatus = 'applied' | 'reviewing' | 'shortlisted' | 'rejected';

export interface IJobPost {
  _id: string;
  id?: string;
  hrUserId: string;
  title: string;
  companyName: string;
  department?: string;
  profession: string;
  location?: string;
  workplaceType: WorkplaceType;
  experienceYears: number;
  salaryRange?: string;
  skills: string[];
  description?: string;
  status: JobStatus;
  applicantCount?: number;
  matchScore?: number;
  matchingSkills?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IJobCreatePayload {
  title: string;
  companyName: string;
  department?: string;
  profession: string;
  location?: string;
  workplaceType?: WorkplaceType;
  experienceYears?: number;
  salaryRange?: string;
  skills: string[];
  description?: string;
}

export interface IJobSearchParams {
  searchKey?: string;
  profession?: string;
  workplaceType?: WorkplaceType;
  minExperience?: number;
  skills?: string;
  page?: number;
  pageSize?: number;
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface IJobApplicant {
  _id: string;
  jobId: string;
  candidateId: string;
  coverNote?: string;
  status: ApplicationStatus;
  createdAt: string;
  candidate?: {
    _id: string;
    fullName: string;
    email: string;
    headline?: string;
    profession?: string;
    skills?: string[];
    experienceYears?: number;
    profileImage?: string;
  };
}

export interface PaginatedResponse<T> {
  data: T[];
  totalCount: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
