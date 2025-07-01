import { Tldraw } from 'tldraw'
import React, { useState } from 'react'
import { Tldraw, Editor, TldrawApp, TLDocument, createTLStore } from '@tldraw/tldraw'

const [tldrawDoc, setTldrawDoc] = useState<TLDocument | null>(null)

const handleFetchFromBackend = async () => {
  const response = await fetch('https://gpt-tldraw-api.vercel.app/generate-tldraw', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      nodes: [
        { id: '1', type: 'box', text: 'Start' },
        { id: '2', type: 'box', text: 'End' },
      ],
      connectors: [
        { from: '1', to: '2' },
      ],
      style: {},
    }),
  })

  const data = await response.json()
  setTldrawDoc(data.tldrawJson)
}

function App() {
	return (
		<div style={{ position: 'fixed', inset: 0 }}>
			<Tldraw />
		</div>
	)
}

export default App
