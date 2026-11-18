// HomeScreen.jsx — shown before the first message.
// Greeting, "How I can help" and "Not sure where to start?" come from the
// UI Config topic in Copilot Studio (config.home).
import { uiIcon, IconChat } from './icons'

export default function HomeScreen({ config }) {
  const home = config?.home

  if (!home) {
    return (
      <div className="az-welcome az-welcome--loading" aria-hidden="true">
        <span /><span /><span />
      </div>
    )
  }

  return (
    <div className="az-welcome">
      <h2 className="az-welcome__title">{home.title}</h2>
      <p className="az-welcome__intro">{home.intro}</p>

      {home.help?.length > 0 && (
        <div className="az-welcome__help">
          <div className="az-welcome__help-title">{home.helpTitle}</div>
          <ul>
            {home.help.map(h => {
              const Icon = uiIcon(h.icon)
              return (
                <li key={h.label}>
                  <span className="az-welcome__help-icon"><Icon /></span>
                  <span>{h.label}</span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {home.notSureTitle && (
        <div className="az-welcome__notsure">
          <span className="az-welcome__notsure-icon"><IconChat /></span>
          <div>
            <div className="az-welcome__notsure-title">{home.notSureTitle}</div>
            <div className="az-welcome__notsure-text">{home.notSureText}</div>
          </div>
        </div>
      )}
    </div>
  )
}