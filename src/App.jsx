import { useState, useEffect, useRef, useCallback } from 'react'
import { marked } from 'marked'
import useBotConnection from './hooks/useBotConnection'
import useContextPanel, { PANEL } from './hooks/useContextPanel'
import GamesPanel from './components/GamesPanel'
import ContextPanel from './components/ContextPanel'

marked.setOptions({ breaks: true, gfm: true })

function getTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })
}

const SUGGESTED = [
  'What is the price of a business class flight?',
  'What is the price of an economy class flight?',
  'What is the price of a first-class flight?',
  'When is the best time to book a flight?',
  'book a ticket',
  'Show location',
  'Apply leave',
]

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark')
  useEffect(() => {
    if (theme === 'light') document.documentElement.classList.add('light-mode')
    else document.documentElement.classList.remove('light-mode')
    localStorage.setItem('theme', theme)
  }, [theme])

  const [gamesVisible, setGamesVisible] = useState(true)

  const openHRM = useCallback(() => {
    window.open('https://opensource-demo.orangehrmlive.com/web/index.php/auth/login', '_blank', 'width=1400,height=900')
  }, [])

  const [mapOpen, setMapOpen] = useState(false)
  const mapIframeRef = useRef(null)
  const openMap = useCallback(() => {
    if (mapIframeRef.current) mapIframeRef.current.src = 'https://www.openstreetmap.org/export/embed.html?bbox=79.8,6.8,80.0,7.0&layer=mapnik'
    setMapOpen(true)
  }, [])
  const closeMap = useCallback(() => {
    setMapOpen(false)
    setTimeout(() => { if (mapIframeRef.current) mapIframeRef.current.src = '' }, 400)
  }, [])

  const [purchaseOpen, setPurchaseOpen] = useState(false)
  const [pf, setPf] = useState({ name:'', email:'', product:'', quantity:'' })
  const [pfSending, setPfSending] = useState(false)
  const openPurchase = useCallback(() => setPurchaseOpen(true), [])
  const closePurchase = useCallback(() => { setPurchaseOpen(false); setPf({ name:'', email:'', product:'', quantity:'' }) }, [])

  const [extraMsgs, setExtraMsgs] = useState([])
  const addDirectMessage = useCallback((role, text) => {
    setExtraMsgs(prev => [...prev, { id: Date.now(), role, text, ts: getTime() }])
  }, [])

  async function submitPurchase() {
    if (!pf.name || !pf.email || !pf.product || !pf.quantity) { alert('Please fill in all fields.'); return }
    setPfSending(true)
    closePurchase()
    addDirectMessage('bot', `✅ **Order Placed!**\n\nThank you **${pf.name}**! Your order for **${pf.quantity}x ${pf.product}** has been submitted.`)
    setPfSending(false)
  }

  const { panel, closePanel, handleSignal } = useContextPanel()

  const { messages, isTyping, isConnected, init, sendMessage, submitCard } = useBotConnection({
    onSignal:       handleSignal,
    onOpenHRM:      openHRM,
    onOpenMap:      openMap,
    onOpenPurchase: openPurchase,
  })

  useEffect(() => { init() }, [init])

  const allMessages = [...messages, ...extraMsgs].sort((a, b) => a.id - b.id)

  const inputRef   = useRef(null)
  const chatboxRef = useRef(null)

  const send = useCallback((text) => {
    if (!text?.trim()) return
    sendMessage(text)
    if (inputRef.current) { inputRef.current.value = ''; inputRef.current.style.height = 'auto' }
  }, [sendMessage])

  useEffect(() => {
    if (chatboxRef.current) chatboxRef.current.scrollTop = chatboxRef.current.scrollHeight
  }, [allMessages, isTyping])

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
      <header>
        <div className="avatar">✦</div>
        <div className="header-text">
          <h1>AI Assistant</h1>
          <div className="status">
            <div className={`status-dot${isConnected ? '' : ' status-dot--off'}`} />
            {isConnected ? 'Online & ready' : 'Connecting…'}
          </div>
        </div>
        <button id="themeToggle" onClick={() => setTheme(t => t === 'dark' ? 'light' : 'dark')}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </button>
        <button id="reloadBtn" onClick={() => location.reload()}>Reload</button>
      </header>

      <div className="main">
        <div className="chat-panel">
          <div id="chatbox" ref={chatboxRef}>

            {allMessages.length === 0 && (
              <div className="empty-state">
                <div className="empty-icon">✦</div>
                <p>How can I help you today?</p>
                <div className="suggested-questions">
                  {SUGGESTED.map(q => (
                    <button key={q} className="suggested-btn" onClick={() => send(q)}>{q}</button>
                  ))}
                </div>
                <span style={{ marginTop: 4 }}>Play a game on the right while you wait!</span>
              </div>
            )}

            {allMessages.map(msg => {
              const isBot = msg.role === 'bot'
              if (!msg.text?.trim() && !msg.card && !msg.suggestedActions) return null
              return (
                <div key={msg.id}>
                  {msg.text?.trim() && (
                    <div className={`msg-row ${isBot ? 'bot' : 'user'}`}>
                      <div className="msg-icon">{isBot ? '✦' : '👤'}</div>
                      <div className="msg-content">
                        {isBot
                          ? <div className="bubble" dangerouslySetInnerHTML={{ __html: marked.parse(msg.text) }} />
                          : <div className="bubble">{msg.text}</div>
                        }
                        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                          {isBot && <CopyBtn text={msg.text} />}
                          <div className="msg-timestamp">{msg.ts}</div>
                        </div>
                      </div>
                    </div>
                  )}
                  {msg.suggestedActions?.actions?.length > 0 && (
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, padding: '0 0 0 36px' }}>
                      {msg.suggestedActions.actions.map((a, i) => (
                        <button key={i} className="suggested-btn" style={{ maxWidth: 'none', padding: '6px 12px' }}
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
                <div className="msg-icon">✦</div>
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
              placeholder="Ask me anything..."
              onInput={e => { e.target.style.height = 'auto'; e.target.style.height = Math.min(e.target.scrollHeight, 110) + 'px' }}
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send(inputRef.current?.value) } }}
            />
            <button id="sendBtn" onClick={() => send(inputRef.current?.value)}>
              <svg viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="18" height="18">
                <line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>

        <button
          className={`games-toggle${gamesVisible ? ' panel-open' : ''}`}
          onClick={() => setGamesVisible(v => !v)}
        >
          {gamesVisible ? '✕' : '🎮'}
        </button>

        <GamesPanel visible={gamesVisible} />
      </div>

      <ContextPanel panel={panel} onClose={closePanel} onSubmit={submitCard} onCta={send} />

      <div className={`map-overlay${mapOpen ? ' open' : ''}`} onClick={closeMap} />
      <div className={`map-panel${mapOpen ? ' open' : ''}`}>
        <div className="map-header">
          <h3>🗺️ OpenStreetMap</h3>
          <button className="map-close" onClick={closeMap}>✕</button>
        </div>
        <iframe ref={mapIframeRef} className="map-iframe" src="" allow="fullscreen" />
      </div>

      <div className={`purchase-overlay${purchaseOpen ? ' open' : ''}`}>
        <div className="purchase-form-box">
          <h2>🛒 Book a Ticket</h2>
          <p>Fill in your details and we'll process your order.</p>
          {[['Full Name','text','John Doe','name'],['Email Address','email','john@example.com','email']].map(([label,type,ph,key]) => (
            <div className="form-group" key={key}>
              <label>{label}</label>
              <input type={type} placeholder={ph} value={pf[key]} onChange={e => setPf(v => ({ ...v, [key]: e.target.value }))} />
            </div>
          ))}
          <div className="form-group">
            <label>Product</label>
            <select value={pf.product} onChange={e => setPf(v => ({ ...v, product: e.target.value }))}>
              <option value="">Select a product...</option>
              {['Economy Class Ticket', 'Business Class Ticket', 'First Class Ticket', 'Travel Insurance'].map(o => (
                <option key={o} value={o}>{o}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Quantity</label>
            <input type="number" placeholder="1" min="1" max="10" value={pf.quantity} onChange={e => setPf(v => ({ ...v, quantity: e.target.value }))} />
          </div>
          <div className="form-actions">
            <button className="form-cancel" onClick={closePurchase}>Cancel</button>
            <button className="form-submit" disabled={pfSending} onClick={submitPurchase}>
              {pfSending ? 'Sending…' : '✓ Place Order'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}