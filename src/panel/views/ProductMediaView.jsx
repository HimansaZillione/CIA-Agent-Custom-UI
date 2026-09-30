// ProductMediaView.jsx
// Product media content for the right panel (was MediaDrawer.jsx, minus the toggle strip —
// open/close now belongs to RightPanel).
import { useMemo } from 'react'
import ProductSlideshow from '../../components/sidebar/ProductSlideshow'

function SectionLabel({ text }) {
  return <div className="az-media__section-label"><span>{text}</span></div>
}

function sortItems(a, b) {
  if (a.mediaType !== b.mediaType) return a.mediaType === 'image' ? -1 : 1
  return a.displayOrder - b.displayOrder
}

function groupIntoProducts(items) {
  const map = {}, order = []
  for (const item of items) {
    if (!map[item.productSlug]) { map[item.productSlug] = []; order.push(item.productSlug) }
    map[item.productSlug].push(item)
  }
  return order.map(slug => {
    const group = map[slug].sort(sortItems)
    return { slug, name: group[0].name, items: group }
  })
}

export default function ProductMediaView({ product, allMedia = [] }) {
  const layout = useMemo(() => {
    const active = allMedia.filter(i => i.isActive)
    if (!active.length || !product?.productSlug) return null

    const { productSlug, family, category } = product
    const activeItems    = active.filter(i => i.productSlug === productSlug).sort(sortItems)
    const familyGroups   = groupIntoProducts(active.filter(i => i.family === family && i.productSlug !== productSlug))
    const categoryGroups = groupIntoProducts(active.filter(i => i.category === category && i.family !== family))

    return { activeItems, familyGroups, categoryGroups, family, category }
  }, [allMedia, product])

  if (!layout) {
    return <div className="az-media__loading"><div className="az-media__spinner" /></div>
  }

  const { activeItems, familyGroups, categoryGroups, family, category } = layout

  return (
    <div className="az-media">
      {activeItems.length > 0 && (
        <ProductSlideshow
          slug={product.productSlug}
          name={activeItems[0].name}
          items={activeItems}
          isActiveProduct
        />
      )}

      {familyGroups.length > 0 && (
        <>
          <SectionLabel text={`More ${family}`} />
          {familyGroups.map(p => (
            <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} compact />
          ))}
        </>
      )}

      {categoryGroups.length > 0 && (
        <>
          <SectionLabel text={`Also in ${category}`} />
          {categoryGroups.map(p => (
            <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} compact />
          ))}
        </>
      )}
    </div>
  )
}