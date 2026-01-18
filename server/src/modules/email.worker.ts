import { Worker, UnrecoverableError } from 'bullmq'
import { redis } from '../config/redis.js'
import { db } from '../config/db.js'
import { env } from '../config/env.js'
import { sendEmail } from './mailer.js'
import { checkRateLimit } from './rateLimit.js'
import { sleep } from '../utility/sleep.js'
import { addEmailJob } from './email.queue.js'


new Worker(
  'email-queue',
  async job => {
    const { rows } = await db.query(
      `SELECT * FROM emails WHERE id=$1`,
      [job.data.emailId]
    )

    const email = rows[0]
    if (!email) return

    // 🛑 Idempotency check
    if (email.status === 'sent') return

    try {
      const rate = await checkRateLimit(email.sender_email)

      if (!rate.allowed) {
        console.log(
    `[RATE LIMIT] Sender=${email.sender_email} → rescheduled to ${rate.nextRunAt!.toISOString()}`
  )
        await addEmailJob(email.id, rate.nextRunAt!)
         return
      }

      await sendEmail(
        email.recipient_email,
        email.subject,
        email.body
      )

      await db.query(
        `
        UPDATE emails
        SET status='sent', sent_at=NOW(), failure_reason=NULL
        WHERE id=$1
        `,
        [email.id]
      )

      await sleep(Number(env.EMAIL_DELAY_MS))
    } catch (err: any) {
      // ❌ Final attempt failed
      if (job.attemptsMade + 1 >= job.opts.attempts!) {
        await db.query(
          `
          UPDATE emails
          SET status='failed', failure_reason=$1
          WHERE id=$2
          `,
          [err.message, email.id]
        )
      }

      throw err // 👈 REQUIRED for BullMQ retry
    }
  },
  {
    connection: redis,
    concurrency: Number(env.WORKER_CONCURRENCY)
  }
)
