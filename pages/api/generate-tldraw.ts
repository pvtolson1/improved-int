import type { NextApiRequest, NextApiResponse } from 'next'
import { v4 as uuidv4 } from 'uuid'
import { buildTldrawDocument } from '../../utils/diagramBuilder'

const VERCEL_TOKEN = process.env.VERCEL_TOKEN!
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID!

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const { nodes, connectors, style } = req.body
    if (!Array.isArray(nodes) || !Array.isArray(connectors)) {
      return res.status(400).json({ error: 'Missing nodes or connectors' })
    }

    // Build only the records object
    const { records } = buildTldrawDocument(nodes, connectors, style || 'draw')
    const canvasId = uuidv4()

    // PATCH only the records into Edge Config
    const url = new URL(
      `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/items`
    )
    

    const apiRes = await fetch(url.toString(), {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${VERCEL_TOKEN}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        items: [{ operation: 'upsert', key: canvasId, value: records }],
      }),
    })

    if (!apiRes.ok) {
      const err = await apiRes.json()
      console.error('Edge Config write failed:', err)
      throw new Error(err.error?.message || apiRes.statusText)
    }

    return res.status(200).json({ id: canvasId })
  } catch (err: any) {
    console.error('generate-tldraw error:', err)
    return res.status(500).json({ error: err.message })
  }
}