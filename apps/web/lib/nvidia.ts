import OpenAI from 'openai'

export const nvidiaClient = new OpenAI({
  apiKey: process.env.NVIDIA_API_KEY!,
  baseURL: process.env.NVIDIA_API_BASE_URL ?? 'https://integrate.api.nvidia.com/v1',
})

export const NVIDIA_MODELS = {
  ULTRA:     'nvidia/llama-3.1-nemotron-ultra-253b-v1',
  EMBED:     'nvidia/llama-nemotron-embed-1b-v2',
  RERANK:    'nvidia/llama-nemotron-rerank-1b-v2',
  SAFETY:    'nvidia/nemotron-content-safety-reasoning-4b',
  NANO_9B:   'nvidia/nemotron-nano-9b-v2',
  NANO_30B:  'nvidia/nemotron-3-nano-30b-a3b',
  SUPER_49B: 'nvidia/llama-3.3-nemotron-super-49b-v1-5',
} as const

export async function getEmbedding(text: string): Promise<number[]> {
  const response = await nvidiaClient.embeddings.create({
    model: NVIDIA_MODELS.EMBED,
    input: text.slice(0, 2000),
  })
  return response.data[0].embedding
}

export async function nvidiaChatCompletion(
  prompt: string,
  model: string = NVIDIA_MODELS.ULTRA,
  maxTokens: number = 800
): Promise<string> {
  const response = await nvidiaClient.chat.completions.create({
    model,
    messages: [{ role: 'user', content: prompt }],
    max_tokens: maxTokens,
    temperature: 0.3,
  })
  return response.choices[0]?.message?.content ?? ''
}
