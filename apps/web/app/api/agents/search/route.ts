import { prisma } from '@/lib/db'
import { NextRequest, NextResponse } from 'next/server'
import { Division, AgentTier } from '@prisma/client'
import { getEmbedding } from '@/lib/nvidia'

export const dynamic = 'force-dynamic'

function cosineSimilarity(a: number[], b: number[]): number {
  if (a.length !== b.length || a.length === 0) return 0
  let dot = 0, normA = 0, normB = 0
  for (let i = 0; i < a.length; i++) {
    dot += a[i] * b[i]
    normA += a[i] * a[i]
    normB += b[i] * b[i]
  }
  const denom = Math.sqrt(normA) * Math.sqrt(normB)
  return denom === 0 ? 0 : dot / denom
}

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl
  const q = searchParams.get('q') ?? ''
  const division = searchParams.get('division')
  const tier = searchParams.get('tier')

  const baseWhere = {
    ...(division ? { division: division as Division } : {}),
    ...(tier ? { tier: tier as AgentTier } : {}),
  }

  // Short query: text search on name
  if (q.length < 3) {
    const agents = await prisma.agent.findMany({
      where: {
        ...baseWhere,
        ...(q ? { name: { contains: q, mode: 'insensitive' as const } } : {}),
      },
      take: 20,
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ agents })
  }

  // Longer query: try semantic search with NVIDIA embeddings
  try {
    const queryEmbedding = await getEmbedding(q)

    const allAgents = await prisma.agent.findMany({ where: baseWhere })

    // Filter agents that have embeddings (do NOT use Prisma isEmpty on Float[])
    const agentsWithEmbeddings = allAgents.filter((a) => a.embedding.length > 0)

    if (agentsWithEmbeddings.length === 0) {
      throw new Error('No embeddings available')
    }

    const ranked = agentsWithEmbeddings
      .map((agent) => ({
        agent,
        score: cosineSimilarity(queryEmbedding, agent.embedding),
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 20)
      .map(({ agent }) => agent)

    return NextResponse.json({ agents: ranked })
  } catch {
    // Fallback: text search
    const agents = await prisma.agent.findMany({
      where: {
        ...baseWhere,
        name: { contains: q, mode: 'insensitive' as const },
      },
      take: 20,
      orderBy: { name: 'asc' },
    })
    return NextResponse.json({ agents })
  }
}
