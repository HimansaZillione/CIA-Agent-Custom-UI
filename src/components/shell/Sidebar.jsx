// Sidebar.jsx — labelled left sidebar.
// Everything it lists comes from the "UI Config" topic in Copilot Studio (uiConfig);
// this component only knows how to draw it.
//
// compact = icons only (used when the right panel is open, or on narrow screens).
import botAvatar from '../../assets/bot_avatar.png'
import { uiIcon, IconPlus } from './icons'

function Item({ icon, label, active, compact, onClick, variant }) {
  const Icon = uiIcon(icon)
  return (
    <button
      type="button"
      className={`az-side__item${active ? ' az-side__item--active' : ''}${variant ? ` az-side__item--${variant}` : ''}`}
      onClick={onClick}
      title={compact ? label : undefined}
      aria-label={compact ? label : undefined}
      aria-current={active ? 'page' : undefined}
    >
      <span className="az-side__icon"><Icon /></span>
      <span className="az-side__label">{label}</span>
    </button>
  )
}

export default function Sidebar({
  config, isConnected, compact, activeId, onNewConversation, onChallenge, onSolutions, onContact,
}) {
  return (
    <nav className={`az-side${compact ? ' az-side--compact' : ''}`} aria-label="Ask ZILLIONe menu">
      <div className="az-side__brand">
        <img src={botAvatar} alt="" className="az-side__avatar bot-avatar-holographic" />
        <div className="az-side__brand-text">
          <h1 className="az-side__title">Ask ZILLIONe</h1>
          <div className="az-side__status">
            <span className={`az-status-dot${isConnected ? '' : ' az-status-dot--off'}`} />
            {isConnected ? 'Online · Ready to help' : 'Connecting…'}
          </div>
        </div>
      </div>

      <div className="az-side__scroll">
        <button
          type="button"
          className="az-side__new"
          onClick={onNewConversation}
          title={compact ? 'New conversation' : undefined}
          aria-label={compact ? 'New conversation' : undefined}
        >
          <IconPlus />
          <span className="az-side__label">New conversation</span>
        </button>

        {!config && <div className="az-side__loading" aria-hidden="true"><span /><span /><span /></div>}

        {config?.challenges?.length > 0 && (
          <div className="az-side__section">
            <div className="az-side__heading">{config.challengesTitle}</div>
            {config.challenges.map(c => (
              <Item
                key={c.id}
                icon={c.icon}
                label={c.label}
                compact={compact}
                active={activeId === c.id}
                onClick={() => onChallenge(c.id)}
              />
            ))}
          </div>
        )}

        {config && (
          <div className="az-side__section">
            <div className="az-side__heading">{config.exploreTitle}</div>
            {config.solutions && (
              <Item icon={config.solutions.icon} label={config.solutions.label} compact={compact}
                active={activeId === 'solutions'} onClick={onSolutions} />
            )}
          </div>
        )}

        {config?.contact && (
          <div className="az-side__section az-side__section--contact">
            <Item icon={config.contact.icon} label={config.contact.label} compact={compact}
              active={activeId === 'contact'} onClick={onContact} variant="contact" />
          </div>
        )}
      </div>

      {config?.footer && <div className="az-side__footer">{config.footer}</div>}
    </nav>
  )
}