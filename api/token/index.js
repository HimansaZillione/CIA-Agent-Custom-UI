const fetch = require('node-fetch')

const DIRECTLINE_BASE = 'https://directline.botframework.com/v3/directline'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://agreeable-sea-0ba7bfe00.7.azurestaticapps.net',
  'https://zillione-test.vercel.app',
]

// ── Rate limiter ──────────────────────────────────────────────────────────────
const rateLimitMap = new Map()
function isRateLimited(ip) {
  const now = Date.now()
  const windowMs = 60 * 1000
  const maxRequests = 10
  if (!rateLimitMap.has(ip)) { rateLimitMap.set(ip, { count: 1, start: now }); return false }
  const entry = rateLimitMap.get(ip)
  if (now - entry.start > windowMs) { rateLimitMap.set(ip, { count: 1, start: now }); return false }
  if (entry.count >= maxRequests) return true
  entry.count++
  return false
}

// ── Main handler ──────────────────────────────────────────────────────────────
module.exports = async function (context, req) {
  const origin = req.headers['origin'] || ''
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  const corsHeaders = {
    'Access-Control-Allow-Origin':  corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: corsHeaders, body: '' }
    return
  }

  const clientIp = req.headers['x-forwarded-for'] || req.headers['client-ip'] || 'unknown'
  if (isRateLimited(clientIp)) {
    context.res = {
      status: 429,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'Too many requests. Please try again later.' })
    }
    return
  }

  const secret = process.env.DIRECTLINE_SECRET
  if (!secret) {
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'DIRECTLINE_SECRET is not configured.' })
    }
    return
  }

  try {
    const response = await fetch(`${DIRECTLINE_BASE}/tokens/generate`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${secret}` }
    })
    if (!response.ok) throw new Error(`Direct Line responded with ${response.status}`)

    const { token, expires_in } = await response.json()

    context.res = {
      status:  200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, expires_in })
    }

  } catch (err) {
    context.log.error('[token] error:', err.message)
    context.res = {
      status:  500,
      headers: corsHeaders,
      body:    JSON.stringify({ error: 'Failed to generate token.' })
    }
  }
}