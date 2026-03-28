import { PrismaClient, Division, AgentTier } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg(process.env.DATABASE_URL!)
const prisma = new PrismaClient({ adapter })

// ─── Tier S Agents ────────────────────────────────────────────────────────────

const TIER_S_AGENTS = [
  {
    slug: 'security-engineer',
    name: 'Security Engineer',
    division: 'ENGINEERING' as Division,
    description:
      'Production-grade application security agent. Performs SAST/DAST analysis, finds OWASP Top 10 vulnerabilities, reviews authentication flows, and generates remediation reports with code fixes. Integrates with GitHub, Jira, and Slack.',
    emoji: '🔐',
    tier: 'S' as AgentTier,
    fileSize: 2_400_000,
    isFree: false,
    isPremium: true,
    priceUSD: 4900,
    priceINR: 407000,
    tags: ['security', 'appsec', 'sast', 'owasp', 'devsecops', 'vulnerability'],
    tools: ['static-analysis', 'dependency-audit', 'secret-scanner', 'pentest-runner', 'report-generator'],
  },
  {
    slug: 'product-manager',
    name: 'Product Manager',
    division: 'PRODUCT' as Division,
    description:
      'Strategic AI product manager agent. Writes PRDs, user stories, and acceptance criteria from feature briefs. Analyses usage data to prioritise backlogs, conducts competitive research, and produces executive-ready roadmap decks.',
    emoji: '📋',
    tier: 'S' as AgentTier,
    fileSize: 1_800_000,
    isFree: false,
    isPremium: true,
    priceUSD: 3900,
    priceINR: 324000,
    tags: ['product', 'prd', 'roadmap', 'backlog', 'user-stories', 'strategy'],
    tools: ['prd-writer', 'backlog-prioritiser', 'competitor-tracker', 'analytics-reader', 'deck-builder'],
  },
  {
    slug: 'mcp-builder',
    name: 'MCP Builder',
    division: 'ENGINEERING' as Division,
    description:
      'Expert Model Context Protocol server builder. Scaffolds production-ready MCP servers with full tool schemas, OAuth flows, resource endpoints, and deployment configs for Claude, Cursor, and other MCP-compatible hosts.',
    emoji: '🔌',
    tier: 'S' as AgentTier,
    fileSize: 2_100_000,
    isFree: false,
    isPremium: true,
    priceUSD: 4400,
    priceINR: 365000,
    tags: ['mcp', 'integration', 'claude', 'tools', 'api', 'protocol'],
    tools: ['mcp-scaffolder', 'schema-validator', 'oauth-builder', 'deploy-packager', 'test-harness'],
  },
  {
    slug: 'outbound-strategist',
    name: 'Outbound Strategist',
    division: 'SALES' as Division,
    description:
      'High-conversion outbound sales agent. Researches prospects using LinkedIn and company data, writes personalised cold emails and LinkedIn sequences, A/B tests messaging, and tracks reply rates to optimise campaigns continuously.',
    emoji: '🎯',
    tier: 'S' as AgentTier,
    fileSize: 1_600_000,
    isFree: false,
    isPremium: true,
    priceUSD: 3400,
    priceINR: 282000,
    tags: ['sales', 'outbound', 'cold-email', 'linkedin', 'prospecting', 'sequences'],
    tools: ['prospect-researcher', 'email-writer', 'ab-tester', 'crm-sync', 'reply-tracker'],
  },
]

// ─── Bundles ──────────────────────────────────────────────────────────────────

const BUNDLES = [
  {
    slug: 'saas-startup-os',
    name: 'SaaS Startup OS',
    tagline: 'Everything you need to go from idea to first $10K MRR',
    description:
      'The complete operating system for early-stage SaaS founders. Covers product strategy, engineering, sales, and marketing — all the AI agents a solo founder or small team needs to move fast.',
    emoji: '🚀',
    priceUSD: 14900,
    priceINR: 1237000,
    originalPriceUSD: 24900,
    isFeatured: true,
    targetAudience: 'Solo founders, early-stage SaaS startups',
    agentSlugs: ['product-manager', 'outbound-strategist', 'mcp-builder'],
  },
  {
    slug: 'devsecops-shield',
    name: 'DevSecOps Shield',
    tagline: 'Ship secure code without slowing down',
    description:
      'A security-first engineering bundle for teams that can\'t afford a breach. Automated vulnerability detection, dependency auditing, and secure code review baked into your CI/CD pipeline.',
    emoji: '🛡️',
    priceUSD: 9900,
    priceINR: 821000,
    originalPriceUSD: 16900,
    isFeatured: true,
    targetAudience: 'Engineering teams, CTOs, security-conscious startups',
    agentSlugs: ['security-engineer', 'mcp-builder'],
  },
  {
    slug: 'ai-agent-builder-pack',
    name: 'AI Agent Builder Pack',
    tagline: 'Build and ship production MCP agents in days not months',
    description:
      'For developers building AI-powered products. Includes expert agents for MCP server creation, integration engineering, and quality assurance — compress weeks of setup into hours.',
    emoji: '🤖',
    priceUSD: 11900,
    priceINR: 988000,
    originalPriceUSD: 18900,
    isFeatured: false,
    targetAudience: 'AI engineers, indie developers, LLM application builders',
    agentSlugs: ['mcp-builder', 'security-engineer'],
  },
  {
    slug: 'enterprise-sales-machine',
    name: 'Enterprise Sales Machine',
    tagline: 'Fill your pipeline with enterprise deals on autopilot',
    description:
      'The complete enterprise GTM stack. From outbound prospecting and personalised sequences to deal analysis and executive decks — close bigger deals, faster.',
    emoji: '💼',
    priceUSD: 12900,
    priceINR: 1070000,
    originalPriceUSD: 21900,
    isFeatured: true,
    targetAudience: 'Enterprise AEs, revenue teams, B2B SaaS founders',
    agentSlugs: ['outbound-strategist', 'product-manager'],
  },
  {
    slug: 'digital-agency-dream-team',
    name: 'Digital Agency Dream Team',
    tagline: 'Deliver client work at 10x speed without hiring',
    description:
      'Built for freelancers and small agencies. Covers client deliverables across strategy, design briefs, content, and reporting — without the overhead of a full team.',
    emoji: '🎨',
    priceUSD: 13900,
    priceINR: 1154000,
    originalPriceUSD: 23900,
    isFeatured: false,
    targetAudience: 'Freelancers, digital agencies, consultants',
    agentSlugs: ['product-manager', 'outbound-strategist'],
  },
  {
    slug: 'indie-game-studio',
    name: 'Indie Game Studio',
    tagline: 'From concept to launch — the solo dev\'s unfair advantage',
    description:
      'Everything an indie game developer needs to build, market, and ship. Game design documentation, asset pipeline management, community growth, and launch coordination all in one bundle.',
    emoji: '🎮',
    priceUSD: 8900,
    priceINR: 739000,
    originalPriceUSD: 14900,
    isFeatured: false,
    targetAudience: 'Indie game developers, small game studios',
    agentSlugs: ['product-manager', 'outbound-strategist'],
  },
  {
    slug: 'web3-defi-builder',
    name: 'Web3 & DeFi Builder',
    tagline: 'Build secure, audited smart contracts without a security firm',
    description:
      'The essential toolkit for Web3 builders. Smart contract security auditing, tokenomics modeling, community growth, and technical documentation — built for the decentralised web.',
    emoji: '⛓️',
    priceUSD: 16900,
    priceINR: 1403000,
    originalPriceUSD: 27900,
    isFeatured: false,
    targetAudience: 'Web3 founders, DeFi protocol teams, blockchain developers',
    agentSlugs: ['security-engineer', 'mcp-builder', 'outbound-strategist'],
  },
]

// ─── Helpers ──────────────────────────────────────────────────────────────────

async function tryGetEmbedding(text: string): Promise<number[]> {
  try {
    const { getEmbedding } = await import('../lib/nvidia')
    return await getEmbedding(text)
  } catch (err) {
    console.warn('⚠️  Embedding generation skipped (NVIDIA key missing or unavailable):', (err as Error).message)
    return []
  }
}

// ─── Main seed ────────────────────────────────────────────────────────────────

async function main() {
  console.log('🌱 Seeding Agecy database...\n')

  // ── Upsert agents ──
  const agentMap = new Map<string, string>() // slug → id

  for (const agentData of TIER_S_AGENTS) {
    const embeddingInput = `${agentData.name}. ${agentData.description}. Tags: ${agentData.tags.join(', ')}`
    const embedding = await tryGetEmbedding(embeddingInput)

    const agent = await prisma.agent.upsert({
      where: { slug: agentData.slug },
      update: {
        name: agentData.name,
        division: agentData.division,
        description: agentData.description,
        emoji: agentData.emoji,
        tier: agentData.tier,
        fileSize: agentData.fileSize,
        isFree: agentData.isFree,
        isPremium: agentData.isPremium,
        priceUSD: agentData.priceUSD,
        priceINR: agentData.priceINR,
        tags: agentData.tags,
        tools: agentData.tools,
        embedding,
      },
      create: {
        slug: agentData.slug,
        name: agentData.name,
        division: agentData.division,
        description: agentData.description,
        emoji: agentData.emoji,
        tier: agentData.tier,
        fileSize: agentData.fileSize,
        isFree: agentData.isFree,
        isPremium: agentData.isPremium,
        priceUSD: agentData.priceUSD,
        priceINR: agentData.priceINR,
        tags: agentData.tags,
        tools: agentData.tools,
        embedding,
      },
    })

    agentMap.set(agent.slug, agent.id)
    console.log(`✅ Agent: ${agent.emoji} ${agent.name} (${agent.tier}) — $${(agent.priceUSD ?? 0) / 100}`)
  }

  console.log('')

  // ── Upsert bundles ──
  for (const bundleData of BUNDLES) {
    const { agentSlugs, ...bundleFields } = bundleData

    const bundle = await prisma.bundle.upsert({
      where: { slug: bundleData.slug },
      update: bundleFields,
      create: bundleFields,
    })

    // Link bundle items — skip missing agents with a warning
    for (const slug of agentSlugs) {
      const agentId = agentMap.get(slug)
      if (!agentId) {
        console.warn(`⚠️  Bundle "${bundle.name}": agent slug "${slug}" not found — skipping`)
        continue
      }

      await prisma.bundleItem.upsert({
        where: { bundleId_agentId: { bundleId: bundle.id, agentId } },
        update: {},
        create: { bundleId: bundle.id, agentId },
      })
    }

    const savings = Math.round(((bundleData.originalPriceUSD - bundleData.priceUSD) / bundleData.originalPriceUSD) * 100)
    console.log(`✅ Bundle: ${bundle.emoji} ${bundle.name} — $${bundle.priceUSD / 100} (${savings}% off)`)
  }

  console.log('\n✨ Seed complete!')
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
