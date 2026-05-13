import { useState, useRef, useCallback } from 'react'
import { DIRECTLINE_SECRET, DIRECTLINE_BASE, POLL_INTERVAL, EMPTY_STREAK, POLL_TIMEOUT } from '../config/botConfig'
import { PANEL } from './useContextPanel'

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

  const tokenRef    = useRef(null)
  const convIdRef   = useRef(null)
  const watermark   = useRef(null)
  const pollTimer   = useRef(null)
  const initialised = useRef(false)

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
        console.log('[poll] activities:', data.activities)

        const replies = (data.activities ?? []).filter(
          a => a.type === 'message' && a.from?.id !== 'user'
        )

        if (replies.length > 0) {
          hasReply = true; emptyStreak = 0
          setIsTyping(false)
          playSound('receive')

          replies.forEach(r => {
            let text = r.text ?? ''

            if (text.includes('[OPEN_HRM]'))      { text = text.replace('[OPEN_HRM]', '').trim();      setTimeout(onOpenHRM, 400) }
            if (text.includes('[OPEN_MAP]'))      { text = text.replace('[OPEN_MAP]', '').trim();      setTimeout(onOpenMap, 400) }
            if (text.includes('[OPEN_PURCHASE]')) { text = text.replace('[OPEN_PURCHASE]', '').trim(); setTimeout(onOpenPurchase, 400) }

            if (r.channelData?.sidebarAction) {
              onSignal(r.channelData.sidebarAction, r.channelData.payload ?? {}, r.attachments)
            }

            const inlineCard = !r.channelData?.sidebarAction
              ? (r.attachments?.find(a => a.contentType === 'application/vnd.microsoft.card.adaptive')?.content ?? null)
              : null

            const isFormOnly = r.channelData?.sidebarAction === PANEL.FORM && !text.trim()

            if (!isFormOnly && (text.trim() || inlineCard)) {
              addMsg({ role: 'bot', text, card: inlineCard, suggestedActions: r.suggestedActions ?? null })
            }

            if (r.channelData?.sidebarAction && r.suggestedActions?.actions?.length) {
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