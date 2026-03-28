'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Copy, Check } from 'lucide-react'

const TOOLS = [
  { id: 'claude-code', name: 'Claude Code', emoji: '⚡' },
  { id: 'cursor', name: 'Cursor', emoji: '◻' },
  { id: 'copilot', name: 'Copilot', emoji: '🐙' },
  { id: 'aider', name: 'Aider', emoji: '🤖' },
  { id: 'windsurf', name: 'Windsurf', emoji: '🌊' },
]

function getInstallCommand(toolId: string, slug: string): string {
  return `agecy install ${slug} --tool ${toolId}`
}

interface InstallDialogProps {
  agentName: string
  agentEmoji: string
  agentSlug: string
}

export function InstallDialog({ agentName, agentEmoji, agentSlug }: InstallDialogProps) {
  const [copied, setCopied] = useState<string | null>(null)

  const handleCopy = async (text: string, toolId: string) => {
    await navigator.clipboard.writeText(text)
    setCopied(toolId)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg
            bg-amber-500/10 border border-amber-500/20 text-amber-400
            hover:bg-amber-500/20 hover:border-amber-500/30
            transition-all duration-200"
        >
          <Download className="w-3.5 h-3.5" />
          Install
        </button>
      </DialogTrigger>
      <DialogContent
        className="border-white/[0.10] max-w-md"
        style={{
          backdropFilter: 'blur(32px) saturate(1.5)',
          background: 'rgba(9,9,11,0.90)',
        }}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2.5 text-white">
            <span className="text-2xl leading-none">{agentEmoji}</span>
            <span className="text-base">Install {agentName}</span>
          </DialogTitle>
        </DialogHeader>

        <p className="text-xs text-zinc-500 -mt-2">
          Choose your tool and run the command in your terminal.
        </p>

        <Tabs defaultValue="claude-code" className="mt-1">
          <TabsList className="w-full bg-white/[0.04] border border-white/[0.07] h-auto flex flex-wrap gap-0.5 p-1 rounded-xl">
            {TOOLS.map((tool) => (
              <TabsTrigger
                key={tool.id}
                value={tool.id}
                className="flex-1 text-xs py-1.5 rounded-lg data-[state=active]:bg-amber-500/15 data-[state=active]:text-amber-400 data-[state=active]:shadow-none text-zinc-500 hover:text-zinc-300 transition-colors"
              >
                {tool.emoji} {tool.name}
              </TabsTrigger>
            ))}
          </TabsList>

          {TOOLS.map((tool) => {
            const cmd = getInstallCommand(tool.id, agentSlug)
            return (
              <TabsContent key={tool.id} value={tool.id} className="mt-3">
                <div
                  className="relative rounded-xl border border-white/[0.08] p-4 group"
                  style={{ background: 'rgba(0,0,0,0.4)' }}
                >
                  <pre className="text-sm text-emerald-400 font-mono break-all whitespace-pre-wrap pr-8">
                    {cmd}
                  </pre>
                  <button
                    onClick={() => handleCopy(cmd, tool.id)}
                    className="absolute right-3 top-3 p-1.5 rounded-lg bg-white/[0.05] border border-white/[0.08] text-zinc-500 hover:text-zinc-300 transition-all"
                  >
                    {copied === tool.id ? (
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>
                <p className="text-[10px] text-zinc-700 mt-2">
                  Requires Agecy CLI. Run <code className="text-zinc-600">npm i -g agecy</code> to install.
                </p>
              </TabsContent>
            )
          })}
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
