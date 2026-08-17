// detectProduct.js
// Detects which product the bot is talking about from message text.
// Returns { productSlug, family, category } matching a manifest entry,
// or null if no product detected.
//
// Fully data-driven — no hardcoded product lists.
// Adding a new product = add to manifest only. No code change here.

// ─── Generic words that need extra confidence ─────────────────────────────
const GENERIC_WORDS = ['cloud', 'security', 'hosting', 'analytics', 'infrastructure']

// ─── Build keyword map from manifest ─────────────────────────────────────
// Called once when manifest loads. Returns:
// { [keyword]: { productSlug, family, category } }
export function buildKeywordMap(manifest) {
  const map = {}

  manifest.forEach(item => {
    if (!item.isActive) return

    // Derive keywords from name, productSlug, and family
    // e.g. "Panacast 50" → ['panacast 50', 'panacast', '50']
    //      "evolve-2"    → ['evolve 2', 'evolve']
    const terms = [
      item.name.toLowerCase(),
      item.productSlug.replace(/-/g, ' '),
      item.family.toLowerCase(),
      item.category.toLowerCase(),
      // individual words from name
      ...item.name.toLowerCase().split(/\s+/).filter(w => w.length > 2),
    ]

    terms.forEach(term => {
      if (!map[term]) {
        map[term] = {
          productSlug: item.productSlug,
          family:      item.family,
          category:    item.category,
        }
      }
    })
  })

  return map
}

// ─── Main detector ────────────────────────────────────────────────────────
// keywordMap: built from buildKeywordMap(manifest)
// text: bot message text to scan
// Returns: { productSlug, family, category } | null
export function detectProduct(text, keywordMap) {
  if (!text || !keywordMap) return null
  const lower = text.toLowerCase()

  function countWholeWordMatches(kw) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
    return (lower.match(regex) ?? []).length
  }

  let bestMatch  = null
  let bestScore  = 0

  for (const [keyword, productInfo] of Object.entries(keywordMap)) {
    const count = countWholeWordMatches(keyword)
    if (count === 0) continue

    const isGeneric = GENERIC_WORDS.includes(keyword)
    // Specific keywords score 3x; generic only count if multiple hits
    const score = isGeneric ? (count >= 2 ? count : 0) : count * 3

    if (score > bestScore) {
      bestScore  = score
      bestMatch  = productInfo
    }
  }

  return bestMatch  // { productSlug, family, category } | null
}