import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { redis } from '@/lib/redis'

export async function GET(req: NextRequest) {
  const token = req.nextUrl.searchParams.get('token')
  if (!token) return NextResponse.json({ error: 'Token required' }, { status: 400 })

  const userId = await redis.get<string>(`cli-token:${token}`)
  if (!userId) return NextResponse.json({ error: 'Invalid or expired token' }, { status: 401 })

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, name: true },
  })
  if (!user) return NextResponse.json({ error: 'User not found' }, { status: 404 })

  await redis.del(`cli-token:${token}`)

  return NextResponse.json({ valid: true, email: user.email, name: user.name })
}
