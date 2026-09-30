import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { marked } from 'marked'

import useBotConnection               from './hooks/useBotConnection'
import usePanel, { PANEL_MODES }      from './hooks/usePanel'
import Header                         from './components/shell/Header'
import LeftRail                       from './components/shell/LeftRail'
import BrowsePanel                    from './components/shell/BrowsePanel'
import HomeScreen                     from './components/shell/HomeScreen'
import RightPanel                     from './panel/RightPanel'
import StreamingBubble                from './components/StreamingBubble'
import { IconSend }                   from './components/shell/icons'
import { fetchProductMedia }          from './services/mediaService'
import { buildKeywordMap, detectProduct } from './utils/detectProduct'
import { postToHost }                 from './utils/embedBridge'
import { HUMAN_AGENT_PHRASE, categoryForTopic } from './config/topics'
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

// Resolve a [SHOW_PRODUCT:tag] tag against the manifest:
// productSlug → deviceType → category → family
function findMediaByTag(allMedia, tag) {
  return allMedia.find(i => i.productSlug === tag)
      ?? allMedia.find(i => i.deviceType  === tag)
      ?? allMedia.find(i => i.category    === tag)
      ?? allMedia.find(i => i.family      === tag)
      ?? null
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
  const { panel, closePanel, reopenPanel, togglePanel, showProduct, handleSignal } = usePanel()

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
      const match = findMediaByTag(allMedia, payload?.tag)
      if (match) {
        showProduct(
          { productSlug: match.productSlug, family: match.family, category: match.category },
          { auto: false }
        )
      }
      return
    }
    handleSignal(action, payload, attachments)
  }, [allMedia, showProduct, handleSignal])

  const openHRM = useCallback(() => {
    window.open('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', '_blank', 'width=1400,height=900')
  }, [])

  const openMap = useCallback(() => onSignal(PANEL_MODES.SHOW_MAP, {}, []), [onSignal])

  const { messages, isTyping, isConnected, init, sendMessage, submitCard } = useBotConnection({
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
    if (detected) showProduct(detected, { auto: true })
  }, [messages, keywordMap, showProduct])

  // ── Chat helpers ──────────────────────────────────────────────────────────
  const inputRef   = useRef(null)
  const chatboxRef = useRef(null)
  const [activeCategory, setActiveCategory] = useState(null)

  // ── Browse Solutions column ───────────────────────────────────────────────
  // Open by default on the home screen when there's room; closes when the
  // conversation starts so the chat gets the width. The rail reopens it.
  const [browse, setBrowse] = useState(() => ({
    open:     window.innerWidth >= 1100,
    expanded: 'microsoft',
  }))
  const isNarrow = () => window.innerWidth <= 760

  const send = useCallback((text) => {
    if (!text?.trim()) return
    const cat = categoryForTopic(text)
    if (cat) setActiveCategory(cat)
    if (messages.length === 0 || isNarrow()) setBrowse(b => ({ ...b, open: false }))
    sendMessage(text)
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.style.height = 'auto'
    }
  }, [sendMessage, messages.length])

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
  }, [messages, isTyping])

  // ── Left rail ─────────────────────────────────────────────────────────────
  const railActiveId =
    panel.open && panel.mode === PANEL_MODES.SHOW_FORM ? 'contact' : activeCategory

  // Rail icon: open Browse with that category expanded; same icon again closes it.
  const handleRailCategory = useCallback((id) => {
    setBrowse(b => (b.open && b.expanded === id ? { ...b, open: false } : { open: true, expanded: id }))
  }, [])

  const toggleBrowseCategory = useCallback((id) => {
    setBrowse(b => ({ ...b, expanded: b.expanded === id ? null : id }))
  }, [])

  const handleBrowseTopic = useCallback((topic, categoryId) => {
    setActiveCategory(categoryId)
    send(topic)
  }, [send])

  // Person icon: if a contact form already exists this session, bring it back
  // (keeps typed values / submitted state); otherwise start the escalation topic.
  const handleContact = useCallback(() => {
    if (panel.mode === PANEL_MODES.SHOW_FORM) reopenPanel()
    else send(HUMAN_AGENT_PHRASE)
  }, [panel.mode, reopenPanel, send])

  // ── Collapse (only meaningful inside the website iframe) ──────────────────
  const [collapsed, setCollapsed] = useState(false)
  const toggleCollapse = useCallback(() => {
    const next = !collapsed
    setCollapsed(next)
    postToHost(next ? 'collapse' : 'expand')
  }, [collapsed])

  return (
    <div className="az-app">
      <Header isConnected={isConnected} collapsed={collapsed} onToggleCollapse={toggleCollapse} />

      <div className="az-body">
        <LeftRail
          activeId={railActiveId}
          browseOpenId={browse.open ? browse.expanded : null}
          onCategory={handleRailCategory}
          onContact={handleContact}
        />

        <BrowsePanel
          open={browse.open}
          expandedId={browse.expanded}
          activeCategory={activeCategory}
          onToggleCategory={toggleBrowseCategory}
          onSelectTopic={handleBrowseTopic}
          onContact={() => { if (isNarrow()) setBrowse(b => ({ ...b, open: false })); handleContact() }}
          onClose={() => setBrowse(b => ({ ...b, open: false }))}
        />

        {/* ── Chat column ── */}
        <div className="chat-panel az-chat">
          <div id="chatbox" ref={chatboxRef}>

            {messages.length === 0 && (
              <HomeScreen onSelect={send} disabled={!isConnected} />
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
                          ? <StreamingBubble text={msg.text} className="bubble" />
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
          allMedia={allMedia}
          onSubmitCard={submitCard}
        />
      </div>
    </div>
  )
}