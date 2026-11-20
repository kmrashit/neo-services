import { BedrockAgentRuntimeClient, RetrieveAndGenerateCommand } from '@aws-sdk/client-bedrock-agent-runtime';
import { config } from '../../../config';
import { secretManager } from '../../clients';
import { AppError } from '../../core/core-utils/err-util';

export class FortiLLMService {

  async getAnswerFromKnowledgeBase(question: string, orchestrationPrompt: string, generationPrompt: string) {
    try {
      const obiLLMSecrets = await secretManager.get('OBI_LLM').then((res) => JSON.parse(res));

      const client = new BedrockAgentRuntimeClient({ region: config.awsRegion });

      const command = new RetrieveAndGenerateCommand({
        input: { text: question },
        retrieveAndGenerateConfiguration: {
          type: 'KNOWLEDGE_BASE',
          knowledgeBaseConfiguration: {
            knowledgeBaseId: obiLLMSecrets.KNOWLEDGE_BASE_ID,
            modelArn: obiLLMSecrets.KNOWLEDGE_BASE_MODEL_ARN || obiLLMSecrets.INFERENCE_PROFILE_ARN,
            orchestrationConfiguration: {
              promptTemplate: { textPromptTemplate: orchestrationPrompt },
            },
            generationConfiguration: {
              promptTemplate: { textPromptTemplate: generationPrompt },
            },
          },
        },
      });

      return { command, client };
    } catch (error: any) {
      throw new AppError(error.message || 'unknown', { msg: 'Failed to get answer from knowledge base', apiName: 'getAnswerFromKnowledgeBase' });
    }
  }
}
