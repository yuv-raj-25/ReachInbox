import { emailQueue } from '../config/bullmq.js'

export async function addEmailJob(
  emailId: string,
  scheduledAt: Date
) {
  const delay = scheduledAt.getTime() - Date.now()

  return emailQueue.add(
    'send-email',
    { emailId },
    {
      delay: Math.max(delay, 0),
      attempts: 3,
      backoff: {
        type: 'exponential',
        delay: 5000
      },
      removeOnComplete: true,
      removeOnFail: false
    }
  )
}
