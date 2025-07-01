import { NextApiRequest, NextApiResponse } from 'next'
import { get } from '@vercel/edge-config'

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const {
    query: { id },
  } = req

  if (!id || typeof id !== 'string') {
    return res.status(400).json({ error: 'Missing or invalid canvas ID' })
  }

  try {
    const data = await get(id)

    if (!data) {
      return res.status(404).json({ error: 'Canvas not found' })
    }

    res.status(200).json({ tldrawJson: data })
  } catch (err) {
    console.error('[canvas handler] Error retrieving canvas:', err)
    res.status(500).json({ error: 'Failed to retrieve diagram' })
  }
}
