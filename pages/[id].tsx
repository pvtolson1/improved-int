// pages/[id].tsx
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import dynamic from 'next/dynamic'

// Dynamically load Tldraw in the browser only
const Tldraw = dynamic(
  () => import('@tldraw/tldraw').then((mod) => ({ default: mod.Tldraw })),
  { ssr: false }
)

export default function CanvasPage() {
  const { query, isReady } = useRouter()
  const id = typeof query.id === 'string' ? query.id : ''

  // Hold only your raw records map
  const [records, setRecords] = useState<Record<string, any> | null>(null)

  useEffect(() => {
    if (!isReady || !id) return
    fetch(`/api/${id}`)
      .then((r) => r.json())
      .then(({ records }) => {
        setRecords(records)  
      })
      .catch((err) => console.error('Failed to load canvas:', err))
  }, [id, isReady])

  if (!records) {
    return <div>Loading canvas…</div>
  }

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {/*
        initialData must be your plain { [shapeId]: shape } map.
        Tldraw will internally call createTLStore({ initialData })
        and automatically apply any migrations :contentReference[oaicite:0]{index=0}.
      */}
      <Tldraw initialData={records} />
    </div>
  )
}
