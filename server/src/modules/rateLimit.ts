import { redis } from '../config/redis.js'
import { env } from '../config/env.js'

export async function checkRateLimit(sender: string) {
  const now = new Date()
  const hourKey = now.toISOString().slice(0, 13).replace(/[-T:]/g, '')

  const key = `email_count:${sender}:${hourKey}`
  const count = await redis.incr(key)

  if (count === 1) {
    await redis.expire(key, 3600)
  }

  const max = Number(env.MAX_EMAILS_PER_HOUR)

  if (count > max) {
    const nextHour = new Date(now)
    nextHour.setMinutes(0, 0, 0)
    nextHour.setHours(nextHour.getHours() + 1)

    return {
      allowed: false,
      nextRunAt: nextHour
    }
  }

  return { allowed: true }
}
