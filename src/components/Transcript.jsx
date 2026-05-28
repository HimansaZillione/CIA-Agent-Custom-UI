import { useEffect, useRef } from 'react'
import TextBubble from './TextBubble'
import AdaptiveCardRenderer from './AdaptiveCard'

export default function Transcript({ messages, isTyping, onSuggestion }) {
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="ca-transcript">

      {/* Welcome screen — shown until first message arrives */}
      {messages.length === 0 && (
        <div className="ca-welcome">
          {/* ZILLIONe "Z" brand icon */}
          <div
            className="ca-welcome__icon"
            style={{
              width: 56, height: 56, borderRadius: 16,
              background: 'linear-gradient(135deg, #E91E8C, #9333EA)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 24, fontFamily: 'Outfit, sans-serif',
              fontWeight: 700, color: '#fff',
              boxShadow: '0 8px 28px rgba(233, 30, 140, 0.4)',
              marginBottom: 4,
            }}
          >
            Z
          </div>

          <h3 className="ca-welcome__title">
            Welcome to ZILLIONe
          </h3>

          <p className="ca-welcome__subtitle">
            Your AI-powered digital assistant for IT solutions, analytics,
            cybersecurity, cloud infrastructure, and more.
          </p>
        </div>
      )}

      {/* Message list */}
      {messages.map(msg => (
        <div key={msg.id}>
          {/* Text bubble (skip if no text and other content exists) */}
          {(msg.text || (!msg.card && !msg.suggestedActions)) && (
            <TextBubble role={msg.role} text={msg.text} />
          )}

          {/* Inline adaptive card */}
          {msg.card && (
            <div className="ca-msg-row ca-msg-row--bot">
              {/* ZILLIONe Z avatar */}
              <div
                className="ca-avatar"
                style={{
                  background: 'linear-gradient(135deg, #E91E8C, #9333EA)',
                  border: 'none', fontSize: 12,
                  fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff',
                }}
              >
                Z
              </div>
              <AdaptiveCardRenderer cardJson={msg.card} onSubmit={null} />
            </div>
          )}

          {/* Suggested action pills */}
          {msg.suggestedActions?.actions?.length > 0 && (
            <div className="ca-suggestions">
              {msg.suggestedActions.actions.map((action, i) => (
                <button
                  key={i}
                  className="ca-suggestion-btn"
                  onClick={() => onSuggestion(action.value ?? action.title)}
                >
                  {action.title}
                </button>
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Typing indicator */}
      {isTyping && (
        <div className="ca-msg-row ca-msg-row--bot">
          <div
            className="ca-avatar"
            style={{
              background: 'linear-gradient(135deg, #E91E8C, #9333EA)',
              border: 'none', fontSize: 12,
              fontFamily: 'Outfit, sans-serif', fontWeight: 700, color: '#fff',
            }}
          >
            Z
          </div>
          <div className="ca-typing">
            <span className="ca-dot" />
            <span className="ca-dot" />
            <span className="ca-dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}