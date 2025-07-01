// src/CanvasPage.tsx
import { useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Tldraw, createTLStore, defaultShapeUtils } from '@tldraw/tldraw'

export default function CanvasPage() {
  const { id } = useParams()
  const [doc, setDoc] = useState(null)

  useEffect(() => {
    const fetchDoc = async () => {
      const res = await fetch(`https://gpt-tldraw-api.vercel.app/canvas/${id}`)
      const data = await res.json()
      setDoc(data.tldrawJson)
    }

    fetchDoc()
  }, [id])

  return (
    <div style={{ width: '100vw', height: '100vh' }}>
      {doc ? (
        <Tldraw
          persistenceKey={null}
          store={createTLStore({ shapeUtils: defaultShapeUtils })}
          onMount={(editor) => {
            editor.store.loadSnapshot(doc)
          }}
        />
      ) : (
        <p>Loading canvas...</p>
      )}
    </div>
  )
}
