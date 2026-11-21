import { bullMQService, sensiSearch } from '../../clients';
import DsaQuestions from '../../modules/leetcode/models/dsa-quests.model';
import { dsaQuestionsTypesenseSchema } from '../../modules/leetcode/models/questions.collections';
import { candidateTypesenseSchema } from '../../modules/candidate/models/candidates.collections';
import CandidateProfile from '../../modules/candidate/models/candidate.model';
import CandidateBlog from '../../modules/candidate/models/candidate-blog.model';
import { BULLMQQUEUES, TYPSENSE_COLLECTION_NAME } from '../core-constants/common.constants';

/**
 * Reference worker implementation kept for queue pattern reference.
 */
export const initializeBullMQSendNotification = async () => {
  await bullMQService.createWorker(
    BULLMQQUEUES.NOTIFICATION_FALL_DETECTION_QUEUE,
    async (job) => {
      const { IMEI, message } = job.data;
      console.info('Reference worker job:', IMEI, message, job.id);
    },
  );
};

/**
 * Forti AI Worker: Triggered when candidate publishes or updates a blog post.
 * Synthesizes learning velocity, knowledge depth, topic diversity, and leadership qualities.
 */
export const initializeBullMQFortiInsightsWorker = async () => {
  await bullMQService.createWorker(
    BULLMQQUEUES.FORTI_INSIGHTS_QUEUE,
    async (job) => {
      const { candidateId, blogId } = job.data;
      console.info(`[Forti AI Worker] Processing insight synthesis for candidate: ${candidateId}, blog: ${blogId}`);
      try {
        const { FortiService } = await import('../../modules/forti/forti.service');
        const { llmClient, sensiSearch } = await import('../../clients');
        const fortiService = new FortiService(llmClient, sensiSearch);
        await fortiService.synthesizeInsights(candidateId, blogId);
        console.info(`[Forti AI Worker] Successfully synthesized insights for candidate: ${candidateId}`);
      } catch (err: any) {
        console.error('[Forti AI Worker] Error synthesizing insights:', err.message || err);
      }
    },
  );
};

/**
 * Candidate Notifications Worker: Dispatches in-app, email, and connection alerts asynchronously.
 */
export const initializeBullMQSendCandidateNotification = async () => {
  await bullMQService.createWorker(
    BULLMQQUEUES.CANDIDATE_NOTIFICATIONS_QUEUE,
    async (job) => {
      const { recipientId, title, message, type, metadata } = job.data;
      console.info(`[Candidate Notification Worker] Sending ${type} notification to user: ${recipientId}`, title, message, metadata);
      // 1. Create notification document in MongoDB
      // 2. Dispatch real-time WebSocket alert via wsHandler
      // 3. Send email notification via SES if email notifications enabled
    },
  );
};

export const initializeBullMQTypesenseSync = async () => {
  await bullMQService.createWorker(
    BULLMQQUEUES.TYPSENSE_LEETCODE_QUESTIONS_SYNC,
    async (job) => {
      console.info('Starting Typesense Sync:', job.id);

      try {
        try {
          await sensiSearch.getCollection(TYPSENSE_COLLECTION_NAME.DSA_QUESTIONS);
        } catch (err: any) {
          if (err.httpStatus === 404) {
            console.info('Collection not found, creating schema...');
            await sensiSearch.createCollection(dsaQuestionsTypesenseSchema);
          } else { throw err; }
        }
        // 1. Fetch questions from DB
        const questions = await DsaQuestions.find({ questionTitle: { $exists: true } }).lean();

        // 2. Format for Typesense (Ensure ID is a string)
        const documents = questions.map(q => ({
          id: q._id.toString(),
          titleSlug: q.titleSlug,
          questionTitle: q.questionTitle,
          difficulty: q.difficulty,
          categoryTitle: q.categoryTitle,
        }));

        // 3. Bulk Upsert into Typesense
        if (documents.length > 0) {
          await sensiSearch.importCollection(documents, TYPSENSE_COLLECTION_NAME.DSA_QUESTIONS).catch((err: any) => {
            if (err?.importResults) {
              const printList = err.importResults.filter((item: any) => item.success !== true);
              console.error('[BullMQ] importResults', printList);
            }
            return;
          });

          console.info(`Successfully synced ${documents.length} questions.`);
        }
      } catch (error) {
        console.error('Typesense Sync Failed:', error);
        throw error;
      }
    },
  );
};

export async function scheduleTypesenseSync() {
  const cronEvery2Hours = '0 */2 * * *';
  const jobName = 'typesense-leetcode-questions-sync-job';

  await bullMQService.addRepeatedJob(
    BULLMQQUEUES.TYPSENSE_LEETCODE_QUESTIONS_SYNC,
    jobName,
    cronEvery2Hours,
  );

  console.info('Typesense sync job scheduled for every 2 hours.');
}

export const initializeBullMQCandidatesTypesenseSync = async () => {
  await bullMQService.createWorker(
    BULLMQQUEUES.TYPSENSE_CANDIDATES_SYNC,
    async (job) => {
      console.info('Starting Candidates Typesense Sync:', job.id);
      try {
        try {
          await sensiSearch.getCollection(TYPSENSE_COLLECTION_NAME.CANDIDATES);
        } catch (err: any) {
          if (err.httpStatus === 404) {
            console.info('Candidates Collection not found, creating schema...');
            await sensiSearch.createCollection(candidateTypesenseSchema);
          } else {
            throw err;
          }
        }

        const candidates = await CandidateProfile.find({ userId: { $exists: true } }).populate('userId').lean();

        const documents = await Promise.all(candidates.map(async (c: any) => {
          const userIdStr = (c.userId?._id || c.userId).toString();
          const blogs = await CandidateBlog.find({ candidateId: userIdStr, status: 'published' }).lean();
          const blogKeywords = blogs.map(b => `${b.title} ${b.blogKeywords.join(' ')} ${b.content}`).join(' ');

          return {
            id: c._id.toString(),
            userId: userIdStr,
            fullName: c.userId?.fullName || '',
            email: c.userId?.email || '',
            skills: c.skills || [],
            experience: Number(c.experience || 0),
            bio: c.bio || '',
            blogKeywords,
          };
        }));

        if (documents.length > 0) {
          await sensiSearch.importCollection(documents, TYPSENSE_COLLECTION_NAME.CANDIDATES).catch((err: any) => {
            if (err?.importResults) {
              const printList = err.importResults.filter((item: any) => item.success !== true);
              console.error('[BullMQ Candidates] importResults', printList);
            }
          });
          console.info(`Successfully synced ${documents.length} candidates to Typesense.`);
        }
      } catch (error) {
        console.error('Candidates Typesense Sync Failed:', error);
        throw error;
      }
    },
  );
};

export async function scheduleCandidatesTypesenseSync() {
  const cronEvery2Hours = '0 */2 * * *';
  const jobName = 'typesense-candidates-sync-job';

  await bullMQService.addRepeatedJob(
    BULLMQQUEUES.TYPSENSE_CANDIDATES_SYNC,
    jobName,
    cronEvery2Hours,
  );

  console.info('Typesense candidates sync job scheduled for every 2 hours.');
}

// ============================================================================
// BullMQ Fortlio Implementation Reference & Usage Patterns:
// ============================================================================
// 1. Trigger Forti AI Insights on Blog Publish:
// await bullMQService.addJob(
//   BULLMQQUEUES.FORTI_INSIGHTS_QUEUE,
//   'synthesize-candidate-insights',
//   { candidateId: blog.authorId, blogId: blog._id },
//   { removeOnComplete: true, attempts: 3 }
// );
//
// 2. Delayed Notification (e.g., follow-up alert 5 minutes later):
// await bullMQService.addDelayedJob(
//   BULLMQQUEUES.CANDIDATE_NOTIFICATIONS_QUEUE,
//   'connection-request-alert',
//   { recipientId: receiverId, title: 'New Connection Request', message: '...' },
//   5 * 60 * 1000,
//   jobId
// );
//
// 3. Remove or Re-queue an existing job:
// const job = await bullMQService.getJob(BULLMQQUEUES.CANDIDATE_NOTIFICATIONS_QUEUE, jobId);
// if (job) await bullMQService.removeJob(BULLMQQUEUES.CANDIDATE_NOTIFICATIONS_QUEUE, jobId);
