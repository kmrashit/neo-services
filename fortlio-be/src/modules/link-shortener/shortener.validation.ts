import z from 'zod';

export const ShortItValidation = z.object({
  originalUrl: z.string().url(),
  customAlias: z.string().optional(),
  targetType: z.enum(['resume', 'blog', 'custom']).optional(),
  targetId: z.string().optional(),
});

export const ShortValueValidation = z.object({
  shortValue: z.string(),
});

export const ShortCodeValidation = z.object({
  shortCode: z.string(),
});

export const IsKeyAvailableValidation = z.object({
  alias: z.string(),
});

export const DwellTimeValidation = z.object({
  shortCode: z.string(),
  durationSeconds: z.number().min(1).max(86400),
});
