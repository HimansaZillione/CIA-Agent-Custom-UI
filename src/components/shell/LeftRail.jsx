// LeftRail.jsx — category icons down the left edge.
// Clicking a category opens the Browse Solutions column with that category expanded
// (clicking it again closes the column). The person icon is the human channel.
//
// States: magenta ring = the category being discussed · soft highlight = the category
// expanded in the Browse column · teal ring = the human/contact channel.
import { TOPIC_CATEGORIES } from '../../config/topics'
import { RAIL_ICONS, IconUser } from './icons'

export default function LeftRail({ activeId, browseOpenId, onCategory, onContact }) {
  return (
    <nav className="az-rail" aria-label="Browse topics">
      <div className="az-rail__group">
        {TOPIC_CATEGORIES.map(cat => {
          const Icon     = RAIL_ICONS[cat.icon]
          const isActive = activeId === cat.id
          const isOpen   = browseOpenId === cat.id
          return (
            <button
              key={cat.id}
              type="button"
              className={`az-rail__btn${isActive ? ' az-rail__btn--active' : ''}${isOpen ? ' az-rail__btn--open' : ''}`}
              aria-label={cat.label}
              aria-pressed={isOpen}
              title={cat.label}
              onClick={() => onCategory(cat.id)}
            >
              <Icon />
            </button>
          )
        })}
      </div>

      <button
        type="button"
        className={`az-rail__btn az-rail__btn--contact${activeId === 'contact' ? ' az-rail__btn--active' : ''}`}
        aria-label="Talk to our team"
        title="Talk to our team"
        onClick={onContact}
      >
        <IconUser />
      </button>
    </nav>
  )
}