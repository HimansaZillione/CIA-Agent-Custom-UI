import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { marked } from 'marked'

import useBotConnection               from './hooks/useBotConnection'
import usePanel, { PANEL_MODES }      from './hooks/usePanel'
import Header                         from './components/shell/Header'
import Sidebar                        from './components/shell/Sidebar'
import GuidePage                      from './components/shell/GuidePage'
import HomeScreen                     from './components/shell/HomeScreen'
import RightPanel                     from './panel/RightPanel'
import StreamingBubble                from './components/StreamingBubble'
import { IconSend }                   from './components/shell/icons'
import { fetchProductMedia }          from './services/mediaService'
import { buildKeywordMap, detectProduct } from './utils/detectProduct'
import { postToHost, isEmbedded }     from './utils/embedBridge'
import { resolveProductTag, productSelection } from './utils/resolveProductTag'
import { HUMAN_AGENT_PHRASE }         from './config/topics'
import botAvatar                      from './assets/bot_avatar.png'

marked.setOptions({ breaks: true, gfm: true })

// ── Silently preload all images + video thumbnails into browser cache ────────
function preloadMedia(items) {
  items.forEach(item => {
    if (item.mediaType === 'image' && item.url) {
      const img = new Image()
      img.src = item.url
    }
    if (item.mediaType === 'video' && item.thumbnailUrl) {
      const img = new Image()
      img.src = item.thumbnailUrl
    }
  })
}

function CopyBtn({ text }) {
  const [copied, setCopied] = useState(false)
  return (
    <button
      type="button"
      className={`copy-btn${copied ? ' copied' : ''}`}
      aria-label="Copy message"
      onClick={() => navigator.clipboard.writeText(text).then(() => {
        setCopied(true); setTimeout(() => setCopied(false), 2000)
      })}
    >{copied ? '✓' : '📋'}</button>
  )
}

export default function App() {

  // ── Right panel (product media / form / map / info) ───────────────────────
  const { panel, closePanel, reopenPanel, resetPanel, togglePanel, showProduct, handleSignal } = usePanel()

  // ── Media manifest ────────────────────────────────────────────────────────
  const [allMedia, setAllMedia] = useState([])
  const keywordMap = useMemo(() => buildKeywordMap(allMedia), [allMedia])

  useEffect(() => {
    fetchProductMedia()
      .then(data => {
        const active = data.filter(i => i.isActive)
        setAllMedia(active)
        preloadMedia(active)
      })
      .catch(err => console.error('[media] fetch failed', err))
  }, [])

  // ── Bot signals ───────────────────────────────────────────────────────────
  const onSignal = useCallback((action, payload, attachments) => {
    if (action === PANEL_MODES.SHOW_PRODUCT) {
      // Tags with no media (e.g. "cloud" today) resolve to null → panel stays as it is.
      const selection = resolveProductTag(allMedia, payload?.tag)
      if (selection) showProduct(selection, { auto: false })
      return
    }
    handleSignal(action, payload, attachments)
  }, [allMedia, showProduct, handleSignal])

  const openHRM = useCallback(() => {
    window.open('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', '_blank', 'width=1400,height=900')
  }, [])

  const openMap = useCallback(() => onSignal(PANEL_MODES.SHOW_MAP, {}, []), [onSignal])

  const { messages, isTyping, isConnected, uiConfig, init, reset, sendMessage, submitCard } = useBotConnection({
    onSignal,
    onOpenHRM:      openHRM,
    onOpenMap:      openMap,
    onOpenPurchase: () => {},
  })

  useEffect(() => { init() }, [init])

  // Keyword fallback: scan each NEW bot message once for a product mention.
  const lastScannedId = useRef(null)
  useEffect(() => {
    const lastBot = [...messages].reverse().find(m => m.role === 'bot' && m.text)
    if (!lastBot || lastBot.id === lastScannedId.current) return
    lastScannedId.current = lastBot.id
    const detected = detectProduct(lastBot.text, keywordMap)
    if (detected) showProduct(productSelection(detected), { auto: true })
  }, [messages, keywordMap, showProduct])

  // ── Chat helpers ──────────────────────────────────────────────────────────
  const inputRef   = useRef(null)
  const chatboxRef = useRef(null)

  // Centre view: the conversation, or a guide page picked from the sidebar.
  //   { kind: 'chat' } · { kind: 'challenge', id } · { kind: 'solutions' }
  const [view, setView] = useState({ kind: 'chat' })

  // Window width → compact (icons-only) sidebar while the right panel is open
  // and there isn't room for sidebar + chat + panel side by side.
  const [width, setWidth] = useState(() => window.innerWidth)
  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth)
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [])
  const sidebarCompact = panel.open && width < 1400

  const send = useCallback((text) => {
    if (!text?.trim()) return
    setView({ kind: 'chat' })
    sendMessage(text)
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.style.height = 'auto'
    }
  }, [sendMessage])

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
  }, [messages, isTyping, view])

  // ── Sidebar ───────────────────────────────────────────────────────────────
  const sidebarActiveId =
    view.kind === 'challenge' ? view.id :
    view.kind === 'solutions' ? 'solutions' :
    panel.open && panel.mode === PANEL_MODES.SHOW_FORM    ? 'contact' : null

  const activeChallenge = view.kind === 'challenge'
    ? uiConfig?.challenges?.find(c => c.id === view.id)
    : null

  // Person item: if a contact form already exists this session, bring it back
  // (keeps typed values / submitted state); otherwise start the escalation topic.
  const handleContact = useCallback(() => {
    if (panel.mode === PANEL_MODES.SHOW_FORM) reopenPanel()
    else send(uiConfig?.contact?.message ?? HUMAN_AGENT_PHRASE)
  }, [panel.mode, reopenPanel, send, uiConfig])

  const handleNewConversation = useCallback(() => {
    resetPanel()
    setView({ kind: 'chat' })
    lastScannedId.current = null
    reset()
  }, [resetPanel, reset])

  // ── Collapse (only meaningful inside the website iframe) ──────────────────
  const [collapsed, setCollapsed] = useState(false)
  const toggleCollapse = useCallback(() => {
    const next = !collapsed
    setCollapsed(next)
    postToHost(next ? 'collapse' : 'expand')
  }, [collapsed])

  return (
    <div className="az-app">
      <div className="az-body">
        <Sidebar
          config={uiConfig}
          isConnected={isConnected}
          compact={sidebarCompact}
          activeId={sidebarActiveId}
          onNewConversation={handleNewConversation}
          onChallenge={id => setView({ kind: 'challenge', id })}
          onSolutions={() => setView({ kind: 'solutions' })}
          onContact={handleContact}
        />

        {/* ── Chat column ── */}
        <div className={`chat-panel az-chat${isEmbedded ? ' az-chat--embedded' : ''}`}>
          <Header collapsed={collapsed} onToggleCollapse={toggleCollapse} />
          <div id="chatbox" ref={chatboxRef}>

            {view.kind !== 'chat' && (
              <GuidePage
                kind={view.kind}
                challenge={activeChallenge}
                solutions={uiConfig?.solutions}
                backLabel={messages.length > 0 ? 'Back to conversation' : undefined}
                onBack={() => setView({ kind: 'chat' })}
                onSend={send}
                disabled={!isConnected}
              />
            )}

            {/* The conversation stays mounted while a guide page is shown, so
                switching back keeps it exactly as it was (no re-typing). */}
            <div className="az-conversation" hidden={view.kind !== 'chat'}>
            {messages.length === 0 && (
              <HomeScreen config={uiConfig} />
            )}

            {messages.map(msg => {
              const isBot = msg.role === 'bot'
              if (!msg.text?.trim() && !msg.card && !msg.suggestedActions) return null
              return (
                <div key={msg.id}>
                  {msg.text?.trim() && (
                    <div className={`msg-row ${isBot ? 'bot' : 'user'}`}>
                      <div className="msg-icon">
                        {isBot
                          ? <img src={botAvatar} alt="Agent" className="bot-avatar-holographic" />
                          : '👤'}
                      </div>
                      <div className="msg-content">
                        {isBot
                          ? <StreamingBubble id={msg.id} text={msg.text} className="bubble" />
                          : <div className="bubble">{msg.text}</div>}
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {isBot && <CopyBtn text={msg.text} />}
                          <div className="msg-timestamp">{msg.ts}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {msg.suggestedActions?.actions?.length > 0 && (
                    <div className="az-quick-replies">
                      {msg.suggestedActions.actions.map((a, i) => (
                        <button key={i} type="button" className="az-quick-reply"
                          onClick={() => send(a.value ?? a.title)}>
                          {a.title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )
            })}

            {isTyping && (
              <div className="msg-row bot">
                <div className="msg-icon">
                  <img src={botAvatar} alt="Agent" className="bot-avatar-holographic" />
                </div>
                <div className="typing-bubble">
                  <div className="dot" /><div className="dot" /><div className="dot" />
                </div>
              </div>
            )}
            </div>
          </div>

          <div className="input-area">
            <textarea
              ref={inputRef}
              id="userInput"
              rows={1}
              aria-label="Message"
              placeholder="Describe your challenge or question…"
              onInput={e => {
                e.target.style.height = 'auto'
                e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px'
              }}
              onKeyDown={e => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  send(inputRef.current?.value)
                }
              }}
            />
            <button id="sendBtn" type="button" aria-label="Send" onClick={() => send(inputRef.current?.value)}>
              <IconSend />
            </button>
          </div>
        </div>

        {/* ── Single context panel ── */}
        <RightPanel
          panel={panel}
          onClose={closePanel}
          onToggle={togglePanel}
          showcaseTitle={uiConfig?.showcase?.title}
          allMedia={allMedia}
          onSubmitCard={submitCard}
        />
      </div>
    </div>
  )
}