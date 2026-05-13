import { marked } from 'marked'

// Configure marked — safe defaults
marked.setOptions({ breaks: true, gfm: true })

export default function TextBubble({ role, text }) {
  if (!text?.trim()) return null

  const isBot = role === 'bot'

  return (
    <div className={`ca-msg-row ${isBot ? 'ca-msg-row--bot' : 'ca-msg-row--user'}`}>
      <div className="ca-avatar">{isBot ? '🏢' : '👤'}</div>
      <div
        className={`ca-bubble ${isBot ? 'ca-bubble--bot' : 'ca-bubble--user'}`}
        // Bot messages render markdown; user messages are escaped plain text
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
