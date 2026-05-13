import { useState, useRef } from 'react'

export default function InputBar({ onSend, disabled }) {
  const [text, setText] = useState('')
  const textareaRef = useRef(null)

  const handleSend = () => {
    const trimmed = text.trim()
    if (!trimmed || disabled) return
    onSend(trimmed)
    setText('')
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
  }

  const handleInput = (e) => {
    setText(e.target.value)
    // Auto-grow
    e.target.style.height = 'auto'
    e.target.style.height = Math.min(e.target.scrollHeight, 100) + 'px'
  }

  return (
    <div className="ca-input-area">
      <textarea
        ref={textareaRef}
        className="ca-input"
        rows={1}
        placeholder="Type your message…"
        value={text}
        onInput={handleInput}
        onChange={e => setText(e.target.value)}
        onKeyDown={handleKeyDown}
        disabled={disabled}
      />
      <button
        className="ca-send-btn"
        onClick={handleSend}
        disabled={disabled || !text.trim()}
        aria-label="Send"
      >
        <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="22" y1="2" x2="11" y2="13"/>
          <polygon points="22 2 15 22 11 13 2 9 22 2"/>
        </svg>
      </button>
    </div>
  )
}
