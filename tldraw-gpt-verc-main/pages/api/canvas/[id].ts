// pages/api/[id].ts
import type { NextApiRequest, NextApiResponse } from 'next'

const VERCEL_TOKEN   = process.env.VERCEL_TOKEN!
const EDGE_CONFIG_ID = process.env.EDGE_CONFIG_ID!


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const raw = req.query.id
  const id  = Array.isArray(raw) ? raw[0] : raw
  if (!id) return res.status(400).json({ error: 'Missing canvas ID' })

  // 🔍 Debug logs
  console.log('VERCEL_TOKEN present?', Boolean(VERCEL_TOKEN))
  console.log('EDGE_CONFIG_ID present?', Boolean(EDGE_CONFIG_ID))
  

  // ✔️ No slug or teamId on the personal endpoint
  const url = `https://api.vercel.com/v1/edge-config/${EDGE_CONFIG_ID}/item/${id}`

 
  console.log('Fetching from Edge Config URL:', url.toString())

 const apiRes = await fetch(url, {
    method: 'GET',
    headers: { Authorization: `Bearer ${VERCEL_TOKEN}` },
  })
  console.log('Edge Config response status:', apiRes.status)

  const json = await apiRes.json().catch(() => ({}))
  console.log('Edge Config response body:', json)

   if (!apiRes.ok) {
    const json = await apiRes.json().catch(() => ({}))
    console.error('Edge Config read failed:', apiRes.status, json)
    return res.status(apiRes.status).json({ error: json.error?.message || json })
  }

  const body = await apiRes.json()
  const records = typeof body.value === 'string' ? JSON.parse(body.value) : body.value
  return res.status(200).json({ records })
}
