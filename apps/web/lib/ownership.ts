import { prisma } from './db'

export async function checkOwnership(userId: string, agentSlug: string): Promise<boolean> {
  const direct = await prisma.purchase.findFirst({
    where: { userId, agent: { slug: agentSlug }, status: 'COMPLETED' }
  })
  if (direct) return true

  const viaBundle = await prisma.purchase.findFirst({
    where: {
      userId,
      status: 'COMPLETED',
      bundle: { items: { some: { agent: { slug: agentSlug } } } }
    }
  })
  return !!viaBundle
}
