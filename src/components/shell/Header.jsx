// Header.jsx — "Ask ZILLIONe" title bar.
// Collapse and ✕ only render when the app is inside the website iframe (embed.js);
// they have nothing to act on when the app is opened directly.
import botAvatar from '../../assets/bot_avatar.png'
import { isEmbedded, postToHost } from '../../utils/embedBridge'
import { IconCollapse, IconExpand, IconClose } from './icons'

export default function Header({ isConnected, collapsed, onToggleCollapse }) {
  return (
    <div className="az-header">
      <img src={botAvatar} alt="" className="az-header__avatar bot-avatar-holographic" />

      <div className="az-header__brand">
        <h1 className="az-header__title">Ask ZILLION<span>e</span></h1>
        <div className="az-header__status">
          <span className={`az-status-dot${isConnected ? '' : ' az-status-dot--off'}`} />
          {isConnected ? 'Online · Ready to help' : 'Connecting…'}
        </div>
      </div>

      {isEmbedded && (
        <div className="az-header__actions">
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
      )}
    </div>
  )
}