import products from '../config/products'

export default function detectProduct(text) {
  if (!text) return null
  const lower = text.toLowerCase()
  
  let firstMatch = { tag: null, pos: Infinity }

  for (const [tag, product] of Object.entries(products)) {
    product.keywords.forEach(kw => {
      const pos = lower.indexOf(kw)
      if (pos !== -1 && pos < firstMatch.pos) {
        firstMatch = { tag, pos }
      }
    })
  }

  return firstMatch.tag
}
