import { useEffect, useRef } from 'react'
import TextBubble from './TextBubble'
import AdaptiveCardRenderer from './AdaptiveCard'

export default function Transcript({ messages, isTyping, onSuggestion }) {
  const bottomRef = useRef(null)

  // Auto-scroll to bottom on new messages
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, isTyping])

  return (
    <div className="ca-transcript">
      {/* Welcome card — shown until first message */}
      {messages.length === 0 && (
        <div className="ca-welcome">
          <div className="ca-welcome__icon">👋</div>
          <h3 className="ca-welcome__title">Hi, how can we help?</h3>
          <p className="ca-welcome__subtitle">
            Ask me about our Analytics Dashboard, Cloud Infrastructure,
            Cybersecurity, Jabra devices, and more.
          </p>
        </div>
      )}

      {/* Messages */}
      {messages.map(msg => (
        <div key={msg.id}>
          {/* Text bubble */}
          {(msg.text || (!msg.card && !msg.suggestedActions)) && (
            <TextBubble role={msg.role} text={msg.text} />
          )}

          {/* Inline adaptive card (non-sidebar cards stay in transcript) */}
          {msg.card && (
            <div className="ca-msg-row ca-msg-row--bot">
              <div className="ca-avatar">🏢</div>
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
          <div className="ca-avatar">🏢</div>
          <div className="ca-typing">
            <span className="ca-dot" /><span className="ca-dot" /><span className="ca-dot" />
          </div>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  )
}
