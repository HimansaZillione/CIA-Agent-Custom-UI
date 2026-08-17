// MediaPanel.jsx
// Receives allMedia + activeProduct from App.jsx (manifest already fetched there)
// so no duplicate fetch happens.
import { useMemo }           from 'react'
import ProductSlideshow      from './ProductSlideshow'
import './MediaPanel.css'

function SectionLabel({ text }) {
  return (
    <div className="media-panel__section-label">
      <span>{text}</span>
    </div>
  )
}

function groupIntoProducts(items) {
  const map = {}
  const order = []
  for (const item of items) {
    if (!map[item.productSlug]) {
      map[item.productSlug] = []
      order.push(item.productSlug)
    }
    map[item.productSlug].push(item)
  }
  return order.map(slug => {
    const group = map[slug].sort((a, b) => {
      if (a.mediaType !== b.mediaType) return a.mediaType === 'image' ? -1 : 1
      return a.displayOrder - b.displayOrder
    })
    return { slug, name: group[0].name, family: group[0].family, category: group[0].category, items: group }
  })
}

export default function MediaPanel({ activeProduct = null, allMedia = [] }) {
  const layout = useMemo(() => {
    const active = allMedia.filter(i => i.isActive)
    if (!active.length) return null

    if (!activeProduct?.productSlug) {
      return { activeItems: [], familyLabel: null, familyGroups: [], categoryLabel: null, categoryGroups: groupIntoProducts(active) }
    }

    const { productSlug, family, category } = activeProduct

    const activeItems = active
      .filter(i => i.productSlug === productSlug)
      .sort((a, b) => {
        if (a.mediaType !== b.mediaType) return a.mediaType === 'image' ? -1 : 1
        return a.displayOrder - b.displayOrder
      })

    const familyGroups   = groupIntoProducts(active.filter(i => i.family === family && i.productSlug !== productSlug))
    const categoryGroups = groupIntoProducts(active.filter(i => i.category === category && i.family !== family))

    return {
      activeItems,
      familyLabel:    familyGroups.length   ? `More ${family}`      : null,
      familyGroups,
      categoryLabel:  categoryGroups.length ? `Also in ${category}` : null,
      categoryGroups,
    }
  }, [allMedia, activeProduct])

  if (!layout) return (
    <div className="media-panel media-panel--loading">
      <div className="media-panel__spinner" />
    </div>
  )

  const { activeItems, familyLabel, familyGroups, categoryLabel, categoryGroups } = layout

  return (
    <aside className="media-panel">

      {activeItems.length > 0 && (
        <ProductSlideshow
          slug={activeProduct.productSlug}
          name={activeItems[0].name}
          items={activeItems}
          isActiveProduct
        />
      )}

      {familyLabel && familyGroups.length > 0 && (
        <>
          <SectionLabel text={familyLabel} />
          {familyGroups.map(p => (
            <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} compact />
          ))}
        </>
      )}

      {categoryLabel && categoryGroups.length > 0 && (
        <>
          <SectionLabel text={categoryLabel} />
          {categoryGroups.map(p => (
            <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} compact />
          ))}
        </>
      )}

      {!activeProduct && categoryGroups.map(p => (
        <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} />
      ))}

    </aside>
  )
}