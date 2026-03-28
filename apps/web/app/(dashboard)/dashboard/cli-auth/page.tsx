export const dynamic = 'force-dynamic'

import crypto from 'crypto'
import { redirect } from 'next/navigation'
import { auth } from '@/lib/auth'
import { redis } from '@/lib/redis'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default async function CliAuthPage() {
  const session = await auth()
  if (!session?.user?.id) redirect('/login')

  if (!redis) redirect('/dashboard')

  const token = crypto.randomBytes(32).toString('hex')
  await redis.set(`cli-token:${token}`, session.user.id, { ex: 600 })

  return (
    <div className="px-4 sm:px-6 py-6 max-w-2xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-white">CLI Authentication</h1>

      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle className="text-white">Your One-Time Token</CardTitle>
          <CardDescription className="text-zinc-400">
            Run the command below in your terminal to authenticate the Agecy CLI. This token
            expires in 10 minutes and can only be used once.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-zinc-950 rounded-lg p-4 font-mono text-sm space-y-1">
            <p className="text-zinc-500 text-xs"># Run this in your terminal</p>
            <p className="text-emerald-400 break-all select-all">
              agecy auth --token {token}
            </p>
          </div>
          <p className="text-xs text-zinc-500">
            Refresh this page to generate a new token.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
