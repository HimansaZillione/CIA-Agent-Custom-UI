import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { marked } from 'marked'

import useBotConnection          from './hooks/useBotConnection'
import useSidebar                from './hooks/useSidebar'
import { SIDEBAR_MODES }         from './hooks/useSidebar'
import ContextSidebar            from './sidebar/ContextSidebar'
import MediaDrawer               from './components/MediaDrawer'
import StreamingBubble           from './components/StreamingBubble'
import { fetchProductMedia }     from './services/mediaService'
import { buildKeywordMap, detectProduct } from './utils/detectProduct'
import botAvatar                 from './assets/bot_avatar.png'
import escalateCard              from './config/escalateCard'

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

const SUGGESTED = [
  "Cybersecurity Solutions",
  "Power BI Dashboards & Analytics",
  "Cloud Infrastructure & Azure",
  "Microsoft Dynamics 365",
  "SAGE 300 ERP",
  "AI Bots & Agents",
  "Microsoft 365 & Collaboration",
  "Custom Software Development",
  "Jabra Audio & Video Devices",
  "Speak with a Human Agent",
]

export default function App() {

  // ── Theme ─────────────────────────────────────────────────────────────────
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  useEffect(() => {
    document.documentElement.classList.toggle('light-mode', theme === 'light')
    localStorage.setItem('theme', theme)
  }, [theme])

  // ── Sidebar (form / info / map) ───────────────────────────────────────────
  const { sidebar, openSidebar, closeSidebar, handleSidebarSignal } = useSidebar()

  const openEscalation = useCallback(() => {
    openSidebar(SIDEBAR_MODES.SHOW_FORM, { cardJson: escalateCard })
  }, [openSidebar])

  // ── Media drawer ──────────────────────────────────────────────────────────
  const [allMedia,        setAllMedia]        = useState([])
  const [activeProduct,   setActiveProduct]   = useState(null)
  const [mediaDrawerOpen, setMediaDrawerOpen] = useState(false)

  const keywordMap = useMemo(() => buildKeywordMap(allMedia), [allMedia])

  useEffect(() => {
    fetchProductMedia()
      .then(data => {
        const active = data.filter(i => i.isActive)
        setAllMedia(active)
        preloadMedia(active)   // ← images load into cache immediately on app start
      })
      .catch(err => console.error('[media] fetch failed', err))
  }, [])

  const updateActiveProduct = useCallback((text) => {
    if (!text?.trim() || !keywordMap) return
    const detected = detectProduct(text, keywordMap)
    if (detected) {
      setActiveProduct(detected)
      setMediaDrawerOpen(true)
    }
  }, [keywordMap])

  // ── Bot connection ────────────────────────────────────────────────────────
  
  const onSignal = useCallback((action, payload, attachments) => {
  if (action === 'SHOW_PRODUCT') {
    const { tag } = payload

    // 1. Exact productSlug match (e.g. "evolve-2")
    let match = allMedia.find(i => i.productSlug === tag)

    // 2. deviceType match (e.g. "earbuds", "headset")
    if (!match) match = allMedia.find(i => i.deviceType === tag)

    // 3. Category match (e.g. "jabra")
    if (!match) match = allMedia.find(i => i.category === tag)

    // 4. Family match (e.g. "panacast")
    if (!match) match = allMedia.find(i => i.family === tag)

    if (match) {
      setActiveProduct({
        productSlug: match.productSlug,
        family:      match.family,
        category:    match.category,
      })
      setMediaDrawerOpen(true)
    }
    return
  }
  handleSidebarSignal(action, payload, attachments)
}, [handleSidebarSignal, allMedia])

  const openHRM = useCallback(() => {
    window.open('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', '_blank', 'width=1400,height=900')
  }, [])

  const openMap = useCallback(() => {
    openSidebar(SIDEBAR_MODES.SHOW_MAP)
  }, [openSidebar])

  const { messages, isTyping, isConnected, init, sendMessage, submitCard } = useBotConnection({
    onSignal,
    onOpenHRM:      openHRM,
    onOpenMap:      openMap,
    onOpenPurchase: () => {},
  })

  useEffect(() => { init() }, [init])

  useEffect(() => {
    const lastBot = [...messages].reverse().find(m => m.role === 'bot' && m.text)
    if (lastBot) updateActiveProduct(lastBot.text)
  }, [messages, updateActiveProduct])

  useEffect(() => {
    document.body.classList.toggle('sidebar-open', sidebar.open)
  }, [sidebar.open])

  // ── Chat helpers ──────────────────────────────────────────────────────────
  const inputRef   = useRef(null)
  const chatboxRef = useRef(null)

  const send = useCallback((text) => {
    if (!text?.trim()) return
    sendMessage(text)
    if (inputRef.current) {
      inputRef.current.value = ''
      inputRef.current.style.height = 'auto'
    }
  }, [sendMessage])

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
  }, [messages, isTyping])

  function CopyBtn({ text }) {
    const [copied, setCopied] = useState(false)
    return (
      <button
        className={`copy-btn${copied ? ' copied' : ''}`}
        onClick={() => navigator.clipboard.writeText(text).then(() => {
          setCopied(true); setTimeout(() => setCopied(false), 2000)
        })}
      >{copied ? '✓' : '📋'}</button>
    )
  }

  return (
    <>
      {/* ── Header ── */}
      <header>
        <div className="avatar">
          <img src={botAvatar} alt="ZILLIONe Agent" className="bot-avatar-holographic" />
        </div>
        <div className="header-brand">
          <h1>ZILLION<span>e</span> Digital Assistant</h1>
          <div className="status">
            <div className={`status-dot${isConnected ? '' : ' status-dot--off'}`} />
            {isConnected ? 'Online · Ready to help' : 'Connecting…'}
          </div>
        </div>
        <button id="themeToggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')} title="Toggle theme">
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <button id="reloadBtn" onClick={() => location.reload()}>↺ Reload</button>
      </header>

      {/* ── Main layout ── */}
      <div className="main">

        {/* Chat — shrinks when drawer opens */}
        <div className={`chat-panel ${mediaDrawerOpen && activeProduct ? 'chat-panel--shrunk' : ''}`}>
          <div id="chatbox" ref={chatboxRef}>

            {messages.length === 0 && (
              <div className="empty-state">
                <div className="welcome-brand"><h2>AskZILLIONe</h2></div>
                <p><strong>Hi there!</strong> Select a topic to explore or type in your query.</p>
                <div className="welcome-suggestions">
                  {SUGGESTED.map(q => (
                    <button key={q} className="suggested-btn" onClick={() => send(q)}>{q}</button>
                  ))}
                </div>
              </div>
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
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 0 0 40px' }}>
                      {msg.suggestedActions.actions.map((a, i) => (
                        <button key={i} className="suggested-btn"
                          style={{ maxWidth: 'none', padding: '7px 14px', width: 'auto' }}
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
              placeholder="Ask me about ZILLIONe's solutions…"
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
            <button id="sendBtn" onClick={() => send(inputRef.current?.value)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2"
                strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        {/* Media drawer */}
        {activeProduct && (
          <MediaDrawer
            activeProduct={activeProduct}
            allMedia={allMedia}
            open={mediaDrawerOpen}
            onToggle={() => setMediaDrawerOpen(v => !v)}
          />
        )}

      </div>

      {/* ── Context Sidebar ── */}
      <ContextSidebar
        sidebar={sidebar}
        onClose={closeSidebar}
        onSubmitCard={submitCard}
      />
    </>
  )
}