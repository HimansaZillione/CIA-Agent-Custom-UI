import { marked } from 'marked'

marked.setOptions({ breaks: true, gfm: true })

// ZILLIONe brand "Z" avatar for bot messages
function BotAvatar() {
  return (
    <div
      className="ca-avatar"
      style={{
        background: 'linear-gradient(135deg, #E91E8C, #9333EA)',
        border: 'none',
        fontSize: '12px',
        fontFamily: 'Outfit, sans-serif',
        fontWeight: 700,
        color: '#fff',
        letterSpacing: '0.02em',
        boxShadow: '0 0 10px rgba(233, 30, 140, 0.3)',
        flexShrink: 0,
      }}
    >
      Z
    </div>
  )
}

function UserAvatar() {
  return (
    <div
      className="ca-avatar"
      style={{
        background: 'var(--surface2)',
        border: '1px solid var(--border-sub)',
        fontSize: '13px',
        flexShrink: 0,
      }}
    >
      👤
    </div>
  )
}

export default function TextBubble({ role, text }) {
  if (!text?.trim()) return null

  const isBot = role === 'bot'

  return (
    <div className={`ca-msg-row ${isBot ? 'ca-msg-row--bot' : 'ca-msg-row--user'}`}>
      {isBot ? <BotAvatar /> : <UserAvatar />}

      <div
        className={`ca-bubble ${isBot ? 'ca-bubble--bot' : 'ca-bubble--user'}`}
        {...(isBot
          ? { dangerouslySetInnerHTML: { __html: marked.parse(text) } }
          : {}
        )}
      >
        {!isBot && text}
      </div>
    </div>
  )
}