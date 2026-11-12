// ProductMediaView.jsx — "Real examples" content in the right panel.
//
// Two layouts, driven by the selection from resolveProductTag():
//   product → the asked-about product first (highlighted), then "More <family>",
//             then "Also in <category>"
//   group   → every product in that family / device type / category, side by side;
//             split into family sections only when the group spans several families
//
// Every product gets an "Ask about this" button that sends a question to the bot.
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
    return { slug, name: group[0].name, family: group[0].family, items: group }
  })
}

function buildSections(active, selection) {
  if (selection.scope === 'group') {
    const groups   = groupIntoProducts(active.filter(i => i[selection.field] === selection.value))
    const families = [...new Set(groups.map(g => g.family))]
    if (families.length <= 1) return [{ label: null, groups }]
    return families.map(f => ({ label: f, groups: groups.filter(g => g.family === f) }))
  }

  const { productSlug, family, category } = selection
  const current = groupIntoProducts(active.filter(i => i.productSlug === productSlug))
  return [
    { label: null,               groups: current, highlight: true },
    { label: `More ${family}`,   groups: groupIntoProducts(active.filter(i => i.family === family && i.productSlug !== productSlug)) },
    { label: `Also in ${category}`, groups: groupIntoProducts(active.filter(i => i.category === category && i.family !== family)) },
  ].filter(s => s.groups.length > 0)
}

export default function ProductMediaView({ product, allMedia = [], onAsk }) {
  const sections = useMemo(() => {
    const active = allMedia.filter(i => i.isActive)
    if (!active.length || !product?.key) return null
    return buildSections(active, product)
  }, [allMedia, product])

  if (!sections) {
    return <div className="az-media__loading"><div className="az-media__spinner" /></div>
  }

  return (
    <div className="az-media">
      {sections.map((section, si) => (
        <div key={section.label ?? `s${si}`} className="az-media__section">
          {section.label && <SectionLabel text={section.label} />}
          {section.groups.map(p => (
            <ProductSlideshow
              key={p.slug}
              slug={p.slug}
              name={p.name}
              items={p.items}
              isActiveProduct={!!section.highlight}
              onAsk={onAsk ? () => onAsk(p.name) : undefined}
            />
          ))}
        </div>
      ))}
    </div>
  )
}