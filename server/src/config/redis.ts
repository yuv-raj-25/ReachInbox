import { Redis } from 'ioredis'

export const redis = new Redis(process.env.REDIS_URL!, {
   maxRetriesPerRequest: null,
  enableReadyCheck: false
})

redis.on('connect', () => {
  console.log('[REDIS] connected')
})

redis.on('error', err => {
  console.error('[REDIS] error', err)
})