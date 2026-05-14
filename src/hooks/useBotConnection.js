import { useState, useRef, useCallback } from 'react'
import { DIRECTLINE_SECRET, DIRECTLINE_BASE, POLL_INTERVAL, EMPTY_STREAK, POLL_TIMEOUT } from '../config/botConfig'
import { PANEL } from './useContextPanel'
import escalateCard from '../config/escalateCard'
import detectProduct from '../utils/detectProduct'

function playSound(type) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain); gain.connect(ctx.destination)
    if (type === 'send') {
      osc.frequency.setValueAtTime(600, ctx.currentTime)
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.1)
      gain.gain.setValueAtTime(0.1, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.1)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.1)
    } else {
      osc.frequency.setValueAtTime(450, ctx.currentTime)
      gain.gain.setValueAtTime(0.05, ctx.currentTime)
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.15)
      osc.start(ctx.currentTime); osc.stop(ctx.currentTime + 0.15)
    }
  } catch {}
}

export default function useBotConnection({ onSignal, onOpenHRM, onOpenMap, onOpenPurchase }) {
  const [messages, setMessages]       = useState([])
  const [isTyping, setIsTyping]       = useState(false)
  const [isConnected, setIsConnected] = useState(false)

  const tokenRef        = useRef(null)
  const convIdRef       = useRef(null)
  const watermark       = useRef(null)
  const pollTimer       = useRef(null)
  const initialised     = useRef(false)
  // When true, the next incoming adaptive card attachment is swallowed
  // (it belongs to the sidebar, not the chat)
  const suppressNextCard = useRef(false)

  const addMsg = useCallback((msg) => {
    setMessages(prev => [...prev, {
      id: Date.now() + Math.random(),
      ts: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }),
      ...msg
    }])
  }, [])

  const stopPoll = useCallback(() => {
    clearInterval(pollTimer.current)
    pollTimer.current = null
  }, [])

  // ── Init ──────────────────────────────────────────────────────────────────
  const init = useCallback(async () => {
    if (initialised.current) return
    initialised.current = true
    try {
      const { token } = await (await fetch(`${DIRECTLINE_BASE}/tokens/generate`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${DIRECTLINE_SECRET}` }
      })).json()
      tokenRef.current = token

      const { conversationId } = await (await fetch(`${DIRECTLINE_BASE}/conversations`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      })).json()
      convIdRef.current = conversationId

      setIsConnected(true)
    } catch (e) {
      console.error('[bot] init failed', e)
      initialised.current = false
    }
  }, [])

  // ── Poll ──────────────────────────────────────────────────────────────────
  const startPoll = useCallback(() => {
    stopPoll()
    let emptyStreak = 0, hasReply = false
    const started = Date.now()

    pollTimer.current = setInterval(async () => {
      if (Date.now() - started > POLL_TIMEOUT) { stopPoll(); setIsTyping(false); return }
      try {
        const data = await (await fetch(
          `${DIRECTLINE_BASE}/conversations/${convIdRef.current}/activities?watermark=${watermark.current ?? ''}`,
          { headers: { Authorization: `Bearer ${tokenRef.current}` } }
        )).json()
        watermark.current = data.watermark
        
        const replies = (data.activities ?? []).filter(
          a => a.type === 'message' && a.from?.id !== 'user'
        )
        console.log('[poll] replies:', JSON.stringify(replies, null, 2))

        if (replies.length > 0) {
          hasReply = true; emptyStreak = 0
          setIsTyping(false)
          playSound('receive')

          replies.forEach(r => {
            let text = r.text ?? ''

            // ── Text signal detection ──────────────────────────────────────
            if (text.includes('[OPEN_HRM]')) {
              text = text.replace('[OPEN_HRM]', '').trim()
              setTimeout(onOpenHRM, 400)
            }
            if (text.includes('[OPEN_MAP]')) {
              text = text.replace('[OPEN_MAP]', '').trim()
              setTimeout(onOpenMap, 400)
            }
            if (text.includes('[OPEN_PURCHASE]')) {
              text = text.replace('[OPEN_PURCHASE]', '').trim()
              setTimeout(onOpenPurchase, 400)
            }

            // ── [SHOW_FORM] — open sidebar with local card JSON ────────────
            if (text.includes('[SHOW_FORM]')) {
              text = text.replace('[SHOW_FORM]', '').trim()
              suppressNextCard.current = true   // swallow the bot's next card
              setTimeout(() => {
                onSignal(PANEL.FORM, { cardJson: escalateCard }, [])
              }, 400)
              // If nothing else left to say, skip adding a bubble
              if (!text) return
            }

            // ── channelData sidebar signal (future use) ────────────────────
            if (r.channelData?.sidebarAction) {
              onSignal(r.channelData.sidebarAction, r.channelData.payload ?? {}, r.attachments)
            }

            // ── Adaptive card handling ─────────────────────────────────────
            const hasCard = r.attachments?.some(
              a => a.contentType === 'application/vnd.microsoft.card.adaptive'
            )

            // If we're suppressing the next card (it belongs to the sidebar)
            if (hasCard && suppressNextCard.current) {
              suppressNextCard.current = false
              // Only skip if there's no text either
              if (!text.trim()) return
            }

            const inlineCard = (!r.channelData?.sidebarAction && !suppressNextCard.current)
              ? (r.attachments?.find(a => a.contentType === 'application/vnd.microsoft.card.adaptive')?.content ?? null)
              : null

            if (text.trim() || inlineCard) {
              addMsg({ role: 'bot', text, card: inlineCard, suggestedActions: r.suggestedActions ?? null })
              const tag = detectProduct(text)
              if (tag) {
                setTimeout(() => onSignal('SHOW_PRODUCT', { tag }, []), 300)
              }
            }

            if (r.suggestedActions?.actions?.length && !text.trim() && !inlineCard) {
              addMsg({ role: 'bot', text: '', card: null, suggestedActions: r.suggestedActions })
            }
          })

          document.getElementById('sendBtn')?.removeAttribute('disabled')
        } else if (hasReply) {
          if (++emptyStreak >= EMPTY_STREAK) stopPoll()
        }
      } catch (e) { console.error('[bot] poll', e); stopPoll(); setIsTyping(false) }
    }, POLL_INTERVAL)
  }, [addMsg, onSignal, onOpenHRM, onOpenMap, onOpenPurchase, stopPoll])

  // ── Send ──────────────────────────────────────────────────────────────────
  const sendMessage = useCallback(async (text) => {
    if (!text.trim() || !convIdRef.current) return
    playSound('send')
    addMsg({ role: 'user', text })
    setIsTyping(true)
    document.getElementById('sendBtn')?.setAttribute('disabled', true)
    try {
      await fetch(`${DIRECTLINE_BASE}/conversations/${convIdRef.current}/activities`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenRef.current}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'message', from: { id: 'user' }, text })
      })
      startPoll()
    } catch (e) { console.error('[bot] send', e); setIsTyping(false) }
  }, [addMsg, startPoll])

  // ── Submit adaptive card (from sidebar) ───────────────────────────────────
  const submitCard = useCallback(async (data) => {
    if (!convIdRef.current) return
    setIsTyping(true)
    try {
      await fetch(`${DIRECTLINE_BASE}/conversations/${convIdRef.current}/activities`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${tokenRef.current}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ type: 'message', from: { id: 'user' }, value: data, text: '' })
      })
      startPoll()
    } catch (e) { console.error('[bot] submitCard', e); setIsTyping(false) }
  }, [startPoll])

  return { messages, isTyping, isConnected, init, sendMessage, submitCard }
}