import z from 'zod';

export const GetInsightsValidation = z.object({
  candidateId: z.string().length(24, { message: 'candidateId must be 24 characters long' }),
});

export const GenerateInsightsValidation = z.object({
  candidateId: z.string().length(24, { message: 'candidateId must be 24 characters long' }),
});

export const CandidateChatParamsValidation = z.object({
  userId: z.string().length(24, { message: 'userId must be 24 characters long' }),
});

export const CandidateChatQueryValidation = z.object({
  question: z.string().min(1, { message: 'Question cannot be empty' }).max(1000),
});
