import { z } from '../../validations/zod';
import { IdValidation } from '../../validations/common-validation';

export const StartInterviewValidation = z.object({
  interviewType: z.enum(['domain_technical', 'behavioral_leadership', 'case_study']).default('domain_technical'),
  profession: z.string().trim().min(2, 'Profession is required'),
  specialty: z.string().trim().min(2, 'Specialty is required'),
  targetLevel: z.enum(['Junior', 'Mid', 'Senior', 'Staff / Principal', 'Executive']).default('Mid'),
});

export const SubmitResponseValidation = z.object({
  answerText: z.string().trim().min(3, 'Answer must be at least 3 characters long').max(5000),
  audioDurationSeconds: z.number().min(0).max(600).optional(),
});

export const InterviewIdParamValidation = z.object({
  id: IdValidation('id'),
});

export const ToggleVisibilityValidation = z.object({
  isPublic: z.boolean(),
});
