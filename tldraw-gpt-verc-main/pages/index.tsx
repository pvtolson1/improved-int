// pages/index.tsx
import { useState } from 'react'
import { useRouter } from 'next/router'
import type { DiagramNode, Connector } from '../utils/diagramBuilder'

export default function Home() {
  // ⇩⇩⇩ Hooks must live here, inside the component ⇩⇩⇩
  const [nodes, setNodes] = useState<DiagramNode[]>([])
  const [connectors, setConnectors] = useState<Connector[]>([])
  const [style, setStyle] = useState<string>('draw')
  const router = useRouter()

  const handleGenerate = async () => {
    const res = await fetch('/api/generate-tldraw', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nodes, connectors, style }),
    })
    if (!res.ok) {
      console.error('Generation failed:', await res.text())
      return
    }
    const { id } = await res.json()
    router.push(`/${id}`)
  }

  // ⇩⇩⇩ Your render output ⇩⇩⇩
  return (
    <div>
      {/* TODO: Render your tldraw editor here, wiring setNodes and setConnectors */}
      <button onClick={handleGenerate}>
        Generate tldraw Canvas
      </button>
    </div>
  )
}
