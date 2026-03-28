import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const url = process.env.UPSTASH_REDIS_REST_URL ?? ''
const token = process.env.UPSTASH_REDIS_REST_TOKEN ?? ''
const isConfigured = Boolean(url && token)

export const redis: Redis | null = isConfigured ? new Redis({ url, token }) : null

export const checkoutRatelimit: Ratelimit | null = isConfigured
  ? new Ratelimit({
      redis: redis!,
      limiter: Ratelimit.slidingWindow(5, '1 m'),
      analytics: true,
    })
  : null
