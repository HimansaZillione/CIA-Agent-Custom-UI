// GuidePage.jsx — the centre "page" shown when a sidebar item is picked:
//   kind 'challenge' → title, intro and "Examples people ask about" (screens 1–5)
//   kind 'solutions' → the solution areas as cards (screen 6)
// Content comes from the UI Config topic. Picking an example or an area sends a
// message to the bot; the parent then switches back to the conversation.
import { uiIcon, IconChevronLeft, IconChevronRight } from './icons'

export default function GuidePage({ kind, challenge, solutions, backLabel, onBack, onSend, disabled }) {
  if (kind === 'challenge' && challenge) {
    return (
      <section className="az-guide" aria-labelledby="az-guide-title">
        <button type="button" className="az-guide__back" onClick={onBack}>
          <IconChevronLeft /><span>{backLabel ?? challenge.label}</span>
        </button>
        <h2 id="az-guide-title" className="az-guide__title">{challenge.title}</h2>
        <p className="az-guide__intro">{challenge.intro}</p>

        <div className="az-guide__box">
          <div className="az-guide__box-title">Examples people ask about:</div>
          <ul className="az-guide__examples">
            {challenge.examples?.map(ex => (
              <li key={ex.label}>
                <button type="button" className="az-guide__example" disabled={disabled}
                  onClick={() => onSend(ex.message)}>
                  <span>{ex.label}</span>
                  <IconChevronRight />
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>
    )
  }

  if (kind === 'solutions' && solutions) {
    const template = solutions.messageTemplate ?? 'Tell me about your {area} solutions.'
    return (
      <section className="az-guide" aria-labelledby="az-guide-title">
        <button type="button" className="az-guide__back" onClick={onBack}>
          <IconChevronLeft /><span>{backLabel ?? solutions.label}</span>
        </button>
        <h2 id="az-guide-title" className="az-guide__title">{solutions.title}</h2>
        <p className="az-guide__intro">{solutions.intro}</p>

        <div className="az-guide__areas">
          {solutions.areas?.map(area => {
            const Icon = uiIcon(area.icon)
            return (
              <button key={area.name} type="button" className="az-guide__area" disabled={disabled}
                onClick={() => onSend(template.replace('{area}', area.name))}>
                <span className="az-guide__area-icon"><Icon /></span>
                <span className="az-guide__area-text">
                  <span className="az-guide__area-name">{area.name}</span>
                  <span className="az-guide__area-summary">{area.summary}</span>
                </span>
              </button>
            )
          })}
        </div>
      </section>
    )
  }

  return null
}