// Header.jsx — window controls (Collapse / ✕), floating at the top-right of the
// chat column. The brand ("Ask ZILLIONe" + status) now lives at the top of the sidebar.
// Only rendered inside the website iframe (embed.js); opened directly there is
// nothing to collapse or close.
import { isEmbedded, postToHost } from '../../utils/embedBridge'
import { IconCollapse, IconExpand, IconClose } from './icons'

export default function Header({ collapsed, onToggleCollapse }) {
  if (!isEmbedded) return null
  return (
    <div className="az-winctl">
      <button type="button" className="az-header__btn" onClick={onToggleCollapse}>
        {collapsed ? <IconExpand /> : <IconCollapse />}
        <span>{collapsed ? 'Expand' : 'Collapse'}</span>
      </button>
      <span className="az-header__divider" aria-hidden="true" />
      <button
        type="button"
        className="az-header__close"
        onClick={() => postToHost('close')}
        aria-label="Close assistant"
      >
        <IconClose />
      </button>
    </div>
  )
}