// LeftRail.jsx — category icons down the left edge.
// Clicking a category opens a small flyout of its topics (Stage 2 replaces this
// with the full Browse Solutions panel). The person icon is the human channel.
//
// Active-state rule: magenta ring = the category being discussed,
// teal ring = the human/contact channel (teal is the human colour everywhere).
import { useState, useEffect, useRef } from 'react'
import { TOPIC_CATEGORIES } from '../../config/topics'
import { RAIL_ICONS, IconUser } from './icons'

export default function LeftRail({ activeId, onSelectTopic, onContact }) {
  const [openId, setOpenId] = useState(null)
  const railRef = useRef(null)

  // Close the flyout on outside click / Escape
  useEffect(() => {
    if (!openId) return
    const onDown = e => { if (!railRef.current?.contains(e.target)) setOpenId(null) }
    const onKey  = e => { if (e.key === 'Escape') setOpenId(null) }
    document.addEventListener('mousedown', onDown)
    document.addEventListener('keydown', onKey)
    return () => {
      document.removeEventListener('mousedown', onDown)
      document.removeEventListener('keydown', onKey)
    }
  }, [openId])

  return (
    <nav className="az-rail" ref={railRef} aria-label="Browse topics">
      <div className="az-rail__group">
        {TOPIC_CATEGORIES.map(cat => {
          const Icon     = RAIL_ICONS[cat.icon]
          const isActive = activeId === cat.id
          const isOpen   = openId === cat.id
          return (
            <div className="az-rail__item" key={cat.id}>
              <button
                type="button"
                className={`az-rail__btn${isActive ? ' az-rail__btn--active' : ''}${isOpen ? ' az-rail__btn--open' : ''}`}
                aria-label={cat.label}
                aria-expanded={isOpen}
                aria-haspopup="menu"
                title={cat.label}
                onClick={() => setOpenId(isOpen ? null : cat.id)}
              >
                <Icon />
              </button>

              {isOpen && (
                <div className="az-rail__flyout" role="menu" aria-label={cat.label}>
                  <p className="az-rail__flyout-title">{cat.label}</p>
                  {cat.topics.map(topic => (
                    <button
                      key={topic}
                      type="button"
                      role="menuitem"
                      className="az-rail__flyout-item"
                      onClick={() => { setOpenId(null); onSelectTopic(topic, cat.id) }}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              )}
            </div>
          )
        })}
      </div>

      <button
        type="button"
        className={`az-rail__btn az-rail__btn--contact${activeId === 'contact' ? ' az-rail__btn--active' : ''}`}
        aria-label="Talk to our team"
        title="Talk to our team"
        onClick={() => { setOpenId(null); onContact() }}
      >
        <IconUser />
      </button>
    </nav>
  )
}