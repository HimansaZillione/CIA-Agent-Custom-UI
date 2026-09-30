// HomeScreen.jsx — "How can I help you today?" intent cards (shown before the first message).
import { HOME_INTENTS } from '../../config/topics'
import { INTENT_ICONS, IconChevronRight } from './icons'

export default function HomeScreen({ onSelect, disabled }) {
  return (
    <div className="az-home">
      <h2 className="az-home__title">How can I help you today?</h2>
      <p className="az-home__subtitle">
        I help you decide, compare, estimate and get in touch — things you won’t find just by browsing.
      </p>

      <div className="az-home__grid">
        {HOME_INTENTS.map(intent => {
          const Icon = INTENT_ICONS[intent.icon]
          return (
            <button
              key={intent.id}
              type="button"
              className="az-home__card"
              disabled={disabled}
              onClick={() => onSelect(intent.message)}
            >
              <span className="az-home__icon"><Icon /></span>
              <span className="az-home__label">{intent.label}</span>
              <span className="az-home__chev"><IconChevronRight /></span>
            </button>
          )
        })}
      </div>
    </div>
  )
}