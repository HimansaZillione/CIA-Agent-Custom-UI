// resolveProductTag.js
// Turns a [SHOW_PRODUCT:<tag>] value from the bot into a panel selection, using only
// the media manifest (no product lists in code).
//
// Tolerant input: slugs ("evolve-2"), display names ("Evolve2 Buds"), any casing,
// spaces, and singular/plural ("dashboard" / "dashboards").
//
// Returns one of:
//   { scope: 'product', key, productSlug, family, category }   ← one specific product
//   { scope: 'group',   key, field, value, family, category }  ← every product in a family / deviceType / category
//   null                                                       ← nothing in the manifest matches

export function slugify(s) {
  return String(s ?? '')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

// Equal once hyphens are ignored ("power-bi" = "powerbi"), or apart from a trailing "s"
function same(a, b) {
  if (!a || !b) return false
  const x = a.replace(/-/g, ''), y = b.replace(/-/g, '')
  return x === y || x === `${y}s` || `${x}s` === y
}

export function productSelection(item) {
  return {
    scope:       'product',
    key:         `product:${item.productSlug}`,
    productSlug: item.productSlug,
    family:      item.family,
    category:    item.category,
  }
}

// Narrowest group first: family ("panacast") → deviceType ("headset") → category ("jabra")
const GROUP_FIELDS = ['family', 'deviceType', 'category']

export function resolveProductTag(allMedia, rawTag) {
  const tag = slugify(rawTag)
  if (!tag || tag === 'null' || !allMedia?.length) return null

  // 1. A specific product — by slug or by any of its item names
  const product = allMedia.find(i => same(slugify(i.productSlug), tag) || same(slugify(i.name), tag))
  if (product) return productSelection(product)

  // 2. A group of products
  for (const field of GROUP_FIELDS) {
    const hit = allMedia.find(i => same(slugify(i[field]), tag))
    if (hit) {
      return {
        scope:    'group',
        key:      `${field}:${hit[field]}`,
        field,
        value:    hit[field],
        family:   hit.family,
        category: hit.category,
      }
    }
  }

  return null
}