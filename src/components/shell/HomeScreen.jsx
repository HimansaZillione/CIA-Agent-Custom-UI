// BrowsePanel.jsx — "Browse solutions" column between the icon rail and the chat.
// Accordion: one category expanded at a time; each category keeps its rail icon.
// Opens from the rail icons; open by default on the home screen (wide layouts).
import { TOPIC_CATEGORIES } from '../../config/topics'
import { RAIL_ICONS, IconChevronRight, IconClose, IconUser } from './icons'

export default function BrowsePanel({
  open, expandedId, activeCategory, onToggleCategory, onSelectTopic, onContact, onClose,
}) {
  return (
    <aside
      className={`az-browse${open ? ' az-browse--open' : ''}`}
      aria-label="Browse solutions"
      aria-hidden={!open}
      {...(!open && { inert: '' })}
    >
      <div className="az-browse__inner">
        <div className="az-browse__header">
          <span className="az-browse__title">Browse solutions</span>
          <button type="button" className="az-browse__close" onClick={onClose} aria-label="Close browse panel">
            <IconClose />
          </button>
        </div>

        <div className="az-browse__list">
          {TOPIC_CATEGORIES.map(cat => {
            const Icon     = RAIL_ICONS[cat.icon]
            const expanded = expandedId === cat.id
            const current  = activeCategory === cat.id
            const regionId = `az-browse-${cat.id}`
            return (
              <div
                key={cat.id}
                className={`az-browse__group${expanded ? ' az-browse__group--expanded' : ''}${current ? ' az-browse__group--current' : ''}`}
              >
                <button
                  type="button"
                  className="az-browse__cat"
                  aria-expanded={expanded}
                  aria-controls={regionId}
                  onClick={() => onToggleCategory(cat.id)}
                >
                  <span className="az-browse__cat-icon"><Icon /></span>
                  <span className="az-browse__cat-label">{cat.label}</span>
                  <span className="az-browse__chev"><IconChevronRight /></span>
                </button>

                <div id={regionId} className="az-browse__topics" {...(!expanded && { inert: '' })}>
                  <ul>
                    {cat.topics.map(topic => (
                      <li key={topic}>
                        <button
                          type="button"
                          className="az-browse__topic"
                          onClick={() => onSelectTopic(topic, cat.id)}
                        >
                          {topic}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )
          })}
        </div>

        <div className="az-browse__footer">
          <button type="button" className="az-browse__human" onClick={onContact}>
            <IconUser />
            <span>Speak with a human</span>
          </button>
        </div>
      </div>
    </aside>
  )
}