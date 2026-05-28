import { marked } from 'marked'
import StreamingBubble from './StreamingBubble'

marked.setOptions({ breaks: true, gfm: true })

export default function TextBubble({ role, text }) {
  if (!text?.trim()) return null
  const isBot = role === 'bot'

  return (
    <div className={`ca-msg-row ${isBot ? 'ca-msg-row--bot' : 'ca-msg-row--user'}`}>
      <div className="ca-avatar">{isBot ? '🏢' : '👤'}</div>

      {isBot ? (
        <StreamingBubble
          text={text}
          className="ca-bubble ca-bubble--bot"
        />
      ) : (
        <div className="ca-bubble ca-bubble--user">{text}</div>
      )}
    </div>
  )
}