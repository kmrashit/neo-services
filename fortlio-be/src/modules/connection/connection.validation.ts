import { z } from '../../validations/zod';
import { IdValidation } from '../../validations/common-validation';

export const CreateConnectionValidation = z.object({
  receiverId: IdValidation('receiverId'),
  message: z.string().trim().max(500).optional(),
});

export const RespondConnectionValidation = z.object({
  action: z.enum(['accept', 'reject']),
});

export const SendMessageValidation = z.object({
  connectionId: IdValidation('connectionId'),
  message: z.string().trim().min(1, 'Message cannot be empty').max(2000),
});

export const ConnectionIdParamValidation = z.object({
  connectionId: IdValidation('connectionId'),
});
