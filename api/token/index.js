const fetch = require('node-fetch')

const DIRECTLINE_BASE  = 'https://directline.botframework.com/v3/directline'
const KEY_VAULT_NAME   = 'CIA-Agent-KV'
const SECRET_NAME      = 'DIRECTLINE-SECRET'

const ALLOWED_ORIGINS = [
  'http://localhost:5173',
  'http://localhost:4173',
  'https://agreeable-sea-0ba7bfe00.7.azurestaticapps.net',
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

// ── Secret fetcher ────────────────────────────────────────────────────────────
async function getSecret() {
  // Local dev fallback
  if (process.env.DIRECTLINE_SECRET) {
    return process.env.DIRECTLINE_SECRET
  }

  // SWA Managed Identity — uses IDENTITY_ENDPOINT, not IMDS
  const identityEndpoint = process.env.IDENTITY_ENDPOINT
  const identityHeader   = process.env.IDENTITY_HEADER

  if (!identityEndpoint) throw new Error('IDENTITY_ENDPOINT not set — Managed Identity not configured')

  const tokenRes = await fetch(
    `${identityEndpoint}?api-version=2019-08-01&resource=https://vault.azure.net`,
    { headers: { 'X-IDENTITY-HEADER': identityHeader } }
  )
  if (!tokenRes.ok) throw new Error(`Managed Identity token fetch failed: ${tokenRes.status}`)
  const { access_token } = await tokenRes.json()

  const secretRes = await fetch(
    `https://${KEY_VAULT_NAME}.vault.azure.net/secrets/${SECRET_NAME}?api-version=7.4`,
    { headers: { Authorization: `Bearer ${access_token}` } }
  )
  if (!secretRes.ok) throw new Error(`Key Vault responded with ${secretRes.status}`)
  const { value } = await secretRes.json()
  return value
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

  try {
    const secret = await getSecret()

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
      body:    JSON.stringify({ error: err.message })
    }
  }
}