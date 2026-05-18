import products from '../config/products'

export default function detectProduct(text) {
  if (!text) return null
  const lower = text.toLowerCase()

  // Match whole words only
  function countWholeWordMatches(kw) {
    const escaped = kw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
    const regex = new RegExp(`\\b${escaped}\\b`, 'gi')
    const matches = lower.match(regex)
    return matches ? matches.length : 0
  }

  // Generic words that need extra confidence to trigger
  const genericWords = ['cloud', 'security', 'hosting', 'analytics', 'infrastructure']

  let bestMatch = { tag: null, score: 0 }

  for (const [tag, product] of Object.entries(products)) {
    let score = 0
    let genericHits = 0
    let specificHits = 0

    product.keywords.forEach(kw => {
      const count = countWholeWordMatches(kw)
      if (count > 0) {
        if (genericWords.includes(kw)) {
          genericHits += count
        } else {
          // Specific keywords like 'jabra', 'cyberark', 'sentinel', 'power bi' score higher
          specificHits += count * 3
        }
      }
    })

    // Only count generic hits if there are multiple OR a specific hit also exists
    if (specificHits > 0) {
      score = specificHits + genericHits
    } else if (genericHits >= 2) {
      score = genericHits
    }

    if (score > bestMatch.score) {
      bestMatch = { tag, score }
    }
  }

  return bestMatch.tag
}
