import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { Division, AgentTier } from '@prisma/client'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const division = searchParams.get('division')
  const tier = searchParams.get('tier')

  const agents = await prisma.agent.findMany({
    where: {
      ...(division ? { division: division as Division } : {}),
      ...(tier ? { tier: tier as AgentTier } : {}),
    },
    take: 20,
    orderBy: { name: 'asc' },
  })

  return NextResponse.json({ agents })
}
