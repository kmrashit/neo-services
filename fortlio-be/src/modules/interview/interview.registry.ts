import { openApiRegistry } from '../../clients';
import { z } from '../../validations/zod';

export function registerInterviewOpenApi() {
  openApiRegistry.register('InterviewSession', z.object({
    _id: z.string(),
    profession: z.string(),
    specialty: z.string(),
    targetLevel: z.string(),
    status: z.string(),
  }));
}
