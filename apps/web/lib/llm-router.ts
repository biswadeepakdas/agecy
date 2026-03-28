/**
 * LLM Router — central AI dispatch for Agecy
 *
 * Routing policy:
 *  - Security-sensitive / user-facing quality: Anthropic Claude
 *  - Embeddings, moderation, bulk inference: NVIDIA NIM (cost-efficient)
 */

import { getEmbedding, nvidiaChatCompletion, NVIDIA_MODELS } from './nvidia'
import { claudeCompletion, ANTHROPIC_MODELS } from './anthropic'

// ─── Agent enrichment ────────────────────────────────────────────────────────

/**
 * Enhance an agent's description with Claude for quality marketplace copy.
 * Uses Anthropic because this is user-facing content quality matters.
 */
export async function enhanceAgentDescription(
  name: string,
  rawDescription: string,
  division: string,
  tools: string[]
): Promise<string> {
  const prompt = `You are writing marketplace copy for an AI agent called "${name}" in the ${division} division.

Raw description: ${rawDescription}
Tools available: ${tools.join(', ')}

Write a concise, compelling 2-3 sentence description for this agent. Focus on concrete value delivered. No marketing fluff. Be specific about what the agent does and who benefits. Return only the description text, nothing else.`

  return claudeCompletion(prompt, ANTHROPIC_MODELS.HAIKU, 300)
}

// ─── Embeddings ──────────────────────────────────────────────────────────────

/**
 * Generate a semantic embedding vector for an agent (for similarity search).
 * Uses NVIDIA NIM — cheap, fast, good enough for retrieval.
 */
export async function getAgentEmbedding(
  name: string,
  description: string,
  tags: string[],
  tools: string[]
): Promise<number[]> {
  const text = `${name}. ${description}. Tags: ${tags.join(', ')}. Tools: ${tools.join(', ')}`
  return getEmbedding(text)
}

// ─── Quality scoring ─────────────────────────────────────────────────────────

/**
 * Score agent quality 1-10 using a lightweight NVIDIA model.
 * Used during seed/ingestion to flag low-quality listings.
 */
export async function scoreAgentQuality(
  name: string,
  description: string,
  tools: string[]
): Promise<number> {
  const prompt = `Rate the quality of this AI agent listing on a scale from 1 to 10.

Agent: ${name}
Description: ${description}
Tools: ${tools.join(', ')}

Criteria: clarity, specificity, practical value, professional tone.
Respond with only a single integer between 1 and 10.`

  try {
    const result = await nvidiaChatCompletion(prompt, NVIDIA_MODELS.NANO_9B, 10)
    const score = parseInt(result.trim(), 10)
    return isNaN(score) ? 5 : Math.min(10, Math.max(1, score))
  } catch {
    return 5
  }
}

// ─── Bundle recommendations ──────────────────────────────────────────────────

/**
 * Generate a personalised bundle recommendation for a user.
 * Uses NVIDIA for speed; this runs on every catalog page load.
 */
export async function generateBundleRecommendation(
  userRole: string,
  ownedSlugs: string[],
  availableBundles: Array<{ name: string; tagline: string; targetAudience: string }>
): Promise<string> {
  const bundleList = availableBundles
    .map((b) => `• ${b.name}: ${b.tagline} (for: ${b.targetAudience})`)
    .join('\n')

  const owned = ownedSlugs.length > 0 ? `Already owns: ${ownedSlugs.join(', ')}` : 'No prior purchases.'

  const prompt = `A user with role "${userRole}" is browsing our AI agent marketplace.
${owned}

Available bundles:
${bundleList}

Recommend the single most relevant bundle for this user in one sentence. Explain why it fits their role. Be direct and specific.`

  return nvidiaChatCompletion(prompt, NVIDIA_MODELS.NANO_9B, 150)
}

// ─── Email generation ────────────────────────────────────────────────────────

/**
 * Generate a purchase confirmation email body with Claude.
 * User-facing email — Anthropic for quality.
 */
export async function generatePurchaseEmailBody(
  userName: string,
  purchaseType: 'agent' | 'bundle',
  itemName: string,
  downloadUrl?: string
): Promise<string> {
  const downloadSection = downloadUrl
    ? `Download link: ${downloadUrl}`
    : 'Your purchase is now available in your Agecy dashboard.'

  const prompt = `Write a friendly, professional purchase confirmation email for an AI agent marketplace called Agecy.

Customer name: ${userName}
Purchase: ${purchaseType === 'bundle' ? 'Bundle' : 'Agent'} — "${itemName}"
${downloadSection}

Keep it warm, brief (3-4 sentences), and include a next step. Return only the email body text (no subject line, no greeting/sign-off needed — those are added separately).`

  return claudeCompletion(prompt, ANTHROPIC_MODELS.HAIKU, 400)
}

// ─── Content moderation ──────────────────────────────────────────────────────

/**
 * Moderate user-submitted content (reviews, agent descriptions) with NVIDIA safety model.
 * Returns true if content is safe.
 */
export async function moderateContent(content: string): Promise<boolean> {
  const prompt = `Is the following content appropriate for a professional B2B SaaS marketplace?
Respond with only "SAFE" or "UNSAFE".

Content: "${content.slice(0, 500)}"`

  try {
    const result = await nvidiaChatCompletion(prompt, NVIDIA_MODELS.SAFETY, 10)
    return result.trim().toUpperCase().includes('SAFE')
  } catch {
    // Fail open — don't block on moderation errors
    return true
  }
}

// ─── Payment failure analysis ────────────────────────────────────────────────

/**
 * Analyse a Stripe/Razorpay payment failure and suggest user-friendly recovery steps.
 * Uses NVIDIA — low-stakes, pattern-matching task.
 */
export async function analyzePaymentFailure(
  errorCode: string,
  errorMessage: string,
  paymentProvider: 'stripe' | 'razorpay'
): Promise<{ userMessage: string; recoverySteps: string[] }> {
  const prompt = `A payment failed on ${paymentProvider} with error code "${errorCode}": "${errorMessage}".

Write:
1. A user-friendly one-sentence explanation (no technical jargon)
2. Up to 3 recovery steps the user can take

Format as JSON:
{
  "userMessage": "...",
  "recoverySteps": ["...", "..."]
}`

  try {
    const raw = await nvidiaChatCompletion(prompt, NVIDIA_MODELS.NANO_9B, 300)
    const match = raw.match(/\{[\s\S]*\}/)
    if (match) {
      const parsed = JSON.parse(match[0]) as { userMessage: string; recoverySteps: string[] }
      return parsed
    }
  } catch {
    // fall through to default
  }

  return {
    userMessage: 'Your payment could not be processed. Please try again or use a different payment method.',
    recoverySteps: [
      'Check your card details and try again',
      'Contact your bank if the issue persists',
      'Try a different payment method',
    ],
  }
}

// ─── Feature PRD generation ──────────────────────────────────────────────────

/**
 * Generate a micro-PRD for a requested platform feature.
 * Uses Claude Sonnet — this is a quality creative/analytical task.
 */
export async function generateFeaturePRD(
  featureRequest: string,
  existingFeatures: string[],
  targetUsers: string
): Promise<string> {
  const prompt = `You are a senior product manager at Agecy, an AI agent marketplace.

Feature request: "${featureRequest}"
Target users: ${targetUsers}
Existing platform features: ${existingFeatures.join(', ')}

Write a concise one-page PRD covering:
1. Problem statement (2 sentences)
2. Proposed solution (3-4 sentences)
3. Success metrics (3 bullet points)
4. Key risks (2 bullet points)
5. MVP scope (numbered list, max 5 items)

Be specific and actionable. No fluff.`

  return claudeCompletion(prompt, ANTHROPIC_MODELS.SONNET, 1000)
}
