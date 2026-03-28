import Anthropic from '@anthropic-ai/sdk'

export const anthropicClient = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const ANTHROPIC_MODELS = {
  SONNET: 'claude-sonnet-4-6',
  HAIKU:  'claude-haiku-4-5',
} as const

export async function claudeCompletion(
  prompt: string,
  model: string = ANTHROPIC_MODELS.SONNET,
  maxTokens: number = 1000
): Promise<string> {
  const message = await anthropicClient.messages.create({
    model,
    max_tokens: maxTokens,
    messages: [{ role: 'user', content: prompt }],
  })
  const block = message.content[0]
  return block.type === 'text' ? block.text : ''
}
