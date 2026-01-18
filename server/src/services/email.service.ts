import { db } from '../config/db.js'
import { addEmailJob } from '../modules/email.queue.js'

export async function scheduleBulkEmails(
  userId: string,
  data: any
) {
  const {
    senderEmail,
    subject,
    body,
    recipients,
    startTime,
    delayBetweenEmailsMs
  } = data

  const baseTime = new Date(startTime).getTime()

  const createdEmails = []
  
  for (let i = 0; i < recipients.length; i++) {
    const scheduledAt = new Date(
      baseTime + i * delayBetweenEmailsMs
    )

    const { rows } = await db.query(
      `
      INSERT INTO emails
      (user_id, sender_email, recipient_email, subject, body, scheduled_at, status)
      VALUES ($1,$2,$3,$4,$5,$6,'scheduled')
      RETURNING id, recipient_email, scheduled_at, status
      `,
      [
        userId,
        senderEmail,
        recipients[i],
        subject,
        body,
        scheduledAt
      ]
    )

    const email = rows[0]
    await addEmailJob(email.id, new Date(email.scheduled_at))
    createdEmails.push(email)
  }
  
  return createdEmails
}

export async function fetchScheduledEmails(userId: string) {
  const { rows } = await db.query(
    `
    SELECT id, sender_email, recipient_email, subject, body, 
           scheduled_at, status, created_at
    FROM emails
    WHERE user_id = $1 AND status = 'scheduled'
    ORDER BY scheduled_at DESC
    `,
    [userId]
  )
  
  return rows
}

export async function fetchSentEmails(userId: string) {
  const { rows } = await db.query(
    `
    SELECT id, sender_email, recipient_email, subject, body, 
           scheduled_at, sent_at, status, created_at
    FROM emails
    WHERE user_id = $1 AND status = 'sent'
    ORDER BY sent_at DESC
    `,
    [userId]
  )
  
  return rows
}
