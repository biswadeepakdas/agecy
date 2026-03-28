import { Redis } from '@upstash/redis'
import { Ratelimit } from '@upstash/ratelimit'

const url = process.env.UPSTASH_REDIS_REST_URL
const token = process.env.UPSTASH_REDIS_REST_TOKEN

const PLACEHOLDERS = ['placeholder', 'your-upstash-url', 'your-upstash-token', 'xxx']

function isReal(v: string | undefined): v is string {
  return Boolean(v && !PLACEHOLDERS.includes(v) && v.length > 10)
}

const isConfigured = isReal(url) && isReal(token)

export const redis: Redis | null = isConfigured
  ? new Redis({ url: url!, token: token! })
  : null

export const checkoutRatelimit: Ratelimit | null = redis
  ? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, '1 m'), analytics: true })
  : null
