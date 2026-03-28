import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

export const redis = (url && token && url.startsWith('https://'))
  ? new Redis({ url, token })
  : null

export const checkoutRatelimit = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), analytics: true })
  : null
