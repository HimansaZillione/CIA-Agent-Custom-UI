const fetch = require('node-fetch')

const DIRECTLINE_SECRET = process.env.DIRECTLINE_SECRET
const DIRECTLINE_BASE   = 'https://directline.botframework.com/v3/directline'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://agreeable-sea-0ba7bfe00.7.azurestaticapps.net',
  // 'https://your-production-domain.com', ← add before deploying
]

module.exports = async function (context, req) {
  const origin = req.headers['origin'] || ''
  const corsOrigin = ALLOWED_ORIGINS.includes(origin) ? origin : ALLOWED_ORIGINS[0]
  const corsHeaders = {
    'Access-Control-Allow-Origin':  corsOrigin,
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  }

  // Handle preflight
  if (req.method === 'OPTIONS') {
    context.res = { status: 204, headers: corsHeaders, body: '' }
    return
  }

  // Guard — secret must be configured
  if (!DIRECTLINE_SECRET) {
    context.res = {
      status: 500,
      headers: corsHeaders,
      body: JSON.stringify({ error: 'DIRECTLINE_SECRET is not configured on the server.' })
    }
    return
  }

  try {
    const response = await fetch(`${DIRECTLINE_BASE}/tokens/generate`, {
      method:  'POST',
      headers: { Authorization: `Bearer ${DIRECTLINE_SECRET}` }
    })

    if (!response.ok) {
      throw new Error(`Direct Line responded with ${response.status}`)
    }

    const { token, expires_in } = await response.json()

    context.res = {
      status:  200,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      body:    JSON.stringify({ token, expires_in })
    }

  } catch (err) {
    context.log.error('[token] Failed to generate token:', err.message)
    context.res = {
      status:  500,
      headers: corsHeaders,
      body:    JSON.stringify({ error: 'Failed to generate Direct Line token.' })
    }
  }
}