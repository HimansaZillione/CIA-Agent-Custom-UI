import { SIDEBAR_MODES } from '../hooks/useSidebar'
import EscalateFormPanel from './EscalateFormPanel'
import InfoPanel         from './InfoPanel'
import LocationPanel     from './LocationPanel'

export default function ContextSidebar({ sidebar, onClose, onSubmitCard }) {
  const { open, mode, payload } = sidebar

  return (
    <div className={`ca-sidebar ${open ? 'ca-sidebar--open' : ''}`}>

      <div className="ca-sidebar__header">
        <span className="ca-sidebar__title">
          {mode === SIDEBAR_MODES.SHOW_FORM && '📋 Contact Us'}
          {mode === SIDEBAR_MODES.SHOW_INFO && 'ℹ️ More Info'}
          {mode === SIDEBAR_MODES.SHOW_MAP  && '🗺️ Location Map'}
          {!mode && 'Details'}
        </span>
        <button className="ca-sidebar__close" onClick={onClose} aria-label="Close sidebar">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none"
            stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>

      <div className="ca-sidebar__body">
        {mode === SIDEBAR_MODES.SHOW_FORM && (
          <EscalateFormPanel
            cardJson={payload?.cardJson}
            onSubmit={onSubmitCard}
            onClose={onClose}
          />
        )}
        {mode === SIDEBAR_MODES.SHOW_INFO && payload && (
          <InfoPanel content={payload.content} />
        )}
        {mode === SIDEBAR_MODES.SHOW_MAP && (
          <LocationPanel />
        )}
      </div>

    </div>
  )
}