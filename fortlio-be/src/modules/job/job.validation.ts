import { z } from 'zod';

export const JobCreateValidation = z.object({
  title: z.string().trim().min(2, { message: 'Title must be at least 2 characters' }),
  companyName: z.string().trim().min(2, { message: 'Company name is required' }),
  department: z.string().trim().optional(),
  profession: z.string().trim().min(2, { message: 'Profession is required' }),
  location: z.string().trim().optional(),
  workplaceType: z.enum(['Remote', 'Hybrid', 'Onsite']).optional(),
  experienceYears: z.number().min(0).optional(),
  salaryRange: z.string().trim().optional(),
  skills: z.array(z.string().trim()).min(1, { message: 'At least one skill is required' }),
  description: z.string().trim().optional(),
});

export const JobUpdateValidation = z.object({
  title: z.string().trim().min(2).optional(),
  companyName: z.string().trim().min(2).optional(),
  department: z.string().trim().optional(),
  profession: z.string().trim().optional(),
  location: z.string().trim().optional(),
  workplaceType: z.enum(['Remote', 'Hybrid', 'Onsite']).optional(),
  experienceYears: z.number().min(0).optional(),
  salaryRange: z.string().trim().optional(),
  skills: z.array(z.string().trim()).optional(),
  description: z.string().trim().optional(),
  status: z.enum(['active', 'closed', 'draft']).optional(),
});

export const JobStatusUpdateValidation = z.object({
  status: z.enum(['active', 'closed', 'draft']),
});

export const JobApplyValidation = z.object({
  coverNote: z.string().trim().optional(),
});
