import Transcript from './Transcript'
import InputBar from './InputBar'

export default function ChatPanel({
  messages, isTyping, isConnected, error, onSend, onSuggestion,
}) {
  return (
    <div className="ca-chat-panel">
      {/* Header */}
      <div className="ca-header">
        <div className="ca-header__logo">🏢</div>
        <div className="ca-header__text">
          <h2 className="ca-header__title">Company Assistant</h2>
          <div className="ca-header__status">
            <span className={`ca-status-dot ${isConnected ? 'ca-status-dot--online' : ''}`} />
            <span>{isConnected ? 'Online · Typically replies instantly' : 'Connecting…'}</span>
          </div>
        </div>
      </div>

      {/* Error banner */}
      {error && (
        <div className="ca-error-banner">{error}</div>
      )}

      {/* Messages */}
      <Transcript
        messages={messages}
        isTyping={isTyping}
        onSuggestion={onSuggestion}
      />

      {/* Input */}
      <InputBar onSend={onSend} disabled={!isConnected} />

      <div className="ca-footer">Powered by Microsoft Copilot Studio</div>
    </div>
  )
}
