import { IFilter } from '../../interface/common.interface';

export interface IJobCreate {
  title: string;
  companyName: string;
  department?: string;
  profession: string;
  location?: string;
  workplaceType?: 'Remote' | 'Hybrid' | 'Onsite';
  experienceYears?: number;
  salaryRange?: string;
  skills: string[];
  description?: string;
}

export interface IJobUpdate {
  title?: string;
  companyName?: string;
  department?: string;
  profession?: string;
  location?: string;
  workplaceType?: 'Remote' | 'Hybrid' | 'Onsite';
  experienceYears?: number;
  salaryRange?: string;
  skills?: string[];
  description?: string;
  status?: 'active' | 'closed' | 'draft';
}

export interface IJobFilter extends IFilter {
  searchKey?: string;
  profession?: string;
  workplaceType?: 'Remote' | 'Hybrid' | 'Onsite';
  minExperience?: number;
  skills?: string[];
}

export interface IJobApplicationCreate {
  coverNote?: string;
}
