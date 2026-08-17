// MediaDrawer.jsx
// Slides in from the right when a product is detected.
// Toggle arrow sits on the left edge of the drawer.
import { useMemo }       from 'react'
import ProductSlideshow  from './sidebar/ProductSlideshow'
import './MediaDrawer.css'

function SectionLabel({ text }) {
  return (
    <div className="media-drawer__section-label">
      <span>{text}</span>
    </div>
  )
}

function groupIntoProducts(items) {
  const map = {}, order = []
  for (const item of items) {
    if (!map[item.productSlug]) { map[item.productSlug] = []; order.push(item.productSlug) }
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

export default function MediaDrawer({ activeProduct, allMedia = [], open, onToggle }) {
  const layout = useMemo(() => {
    const active = allMedia.filter(i => i.isActive)
    if (!active.length || !activeProduct?.productSlug) return null

    const { productSlug, family, category } = activeProduct

    const activeItems    = active
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

  return (
    <div className={`media-drawer ${open ? 'media-drawer--open' : ''}`}>

      {/* Toggle arrow — on left edge of drawer */}
      <button
        className="media-drawer__toggle"
        onClick={onToggle}
        aria-label={open ? 'Close media panel' : 'Open media panel'}
      >
        {open ? '›' : '‹'}
      </button>

      {/* Content */}
      <div className="media-drawer__content">
        {!layout ? (
          <div className="media-drawer__empty">
            <div className="media-drawer__spinner" />
          </div>
        ) : (
          <>
            {layout.activeItems.length > 0 && (
              <ProductSlideshow
                slug={activeProduct.productSlug}
                name={layout.activeItems[0].name}
                items={layout.activeItems}
                isActiveProduct
              />
            )}

            {layout.familyLabel && layout.familyGroups.length > 0 && (
              <>
                <SectionLabel text={layout.familyLabel} />
                {layout.familyGroups.map(p => (
                  <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} compact />
                ))}
              </>
            )}

            {layout.categoryLabel && layout.categoryGroups.length > 0 && (
              <>
                <SectionLabel text={layout.categoryLabel} />
                {layout.categoryGroups.map(p => (
                  <ProductSlideshow key={p.slug} slug={p.slug} name={p.name} items={p.items} compact />
                ))}
              </>
            )}
          </>
        )}
      </div>
    </div>
  )
}