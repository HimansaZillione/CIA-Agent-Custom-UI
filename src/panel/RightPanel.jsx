// RightPanel.jsx — the single context panel.
//
// One container, fixed position in the layout. Opening/closing animates its width;
// changing mode only swaps the content inside (fade + slight rise), so the chat
// column never resizes twice and the visitor never sees "something closed".
//
// Views stay mounted while the panel is closed, so reopening shows the same state.
//
// Arrow strip: once the panel has shown anything, a 28px handle stays on its left
// edge. Closed → only the strip is visible (click to reopen). Open → click to close.
import { PANEL_MODES } from '../hooks/usePanel'
import ProductMediaView  from './views/ProductMediaView'
import EscalateFormPanel from '../sidebar/EscalateFormPanel'
import InfoPanel         from '../sidebar/InfoPanel'
import LocationPanel     from '../sidebar/LocationPanel'
import { IconClose }     from '../components/shell/icons'

const TITLES = {
  [PANEL_MODES.SHOW_PRODUCT]: 'Real examples',
  [PANEL_MODES.SHOW_FORM]:    'Talk to our team',
  [PANEL_MODES.SHOW_MAP]:     'Visit us',
  [PANEL_MODES.SHOW_INFO]:    'More info',
}

export default function RightPanel({ panel, onClose, onToggle, allMedia, onSubmitCard }) {
  const { open, mode, payload } = panel
  const title = TITLES[mode] ?? 'Details'

  function renderView() {
    switch (mode) {
      case PANEL_MODES.SHOW_PRODUCT:
        return <ProductMediaView product={payload?.product} allMedia={allMedia} />
      case PANEL_MODES.SHOW_FORM:
        return <EscalateFormPanel cardJson={payload?.cardJson} onSubmit={onSubmitCard} onClose={onClose} />
      case PANEL_MODES.SHOW_MAP:
        return <LocationPanel />
      case PANEL_MODES.SHOW_INFO:
        return <InfoPanel content={payload?.content} />
      default:
        return null
    }
  }

  return (
    <aside
      className={`az-panel${mode ? ' az-panel--has-content' : ''}${open ? ' az-panel--open' : ''}`}
      aria-label={title}
    >
      {mode && (
        <button
          type="button"
          className="az-panel__toggle"
          onClick={onToggle}
          aria-expanded={open}
          aria-label={open ? `Hide ${title.toLowerCase()}` : `Show ${title.toLowerCase()}`}
          title={open ? 'Hide panel' : 'Show panel'}
        >
          <span className="az-panel__toggle-icon" aria-hidden="true">‹</span>
        </button>
      )}

      <div className="az-panel__inner" aria-hidden={!open} {...(!open && { inert: '' })}>
        <div className="az-panel__header">
          <span className="az-panel__title">{title}</span>
          <button type="button" className="az-panel__close" onClick={onClose} aria-label="Close panel">
            <IconClose />
          </button>
        </div>

        <div className="az-panel__body">
          {/* key={mode}: a mode change remounts the view → in-place fade. */}
          {mode && <div key={mode} className="az-panel__view">{renderView()}</div>}
        </div>
      </div>
    </aside>
  )
}