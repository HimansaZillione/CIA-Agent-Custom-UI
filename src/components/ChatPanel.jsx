import Transcript from './Transcript'
import InputBar from './InputBar'

export default function ChatPanel({
  messages, isTyping, isConnected, error, onSend, onSuggestion,
}) {
  return (
    <div className="ca-chat-panel">

      {/* ── Header ── */}
      <div className="ca-header">
        {/* ZILLIONe brand mark */}
        <div className="ca-header__logo" style={{
          background: 'linear-gradient(135deg, #E91E8C, #9333EA)',
          border: 'none',
          fontSize: '14px',
          fontFamily: 'Outfit, sans-serif',
          fontWeight: 700,
          color: '#fff',
          letterSpacing: '0.03em',
        }}>
          Z
        </div>

        <div className="ca-header__text">
          <h2 className="ca-header__title">
            ZILLION<span style={{ color: 'var(--magenta)' }}>e</span>
          </h2>
          <div className="ca-header__status">
            <span className={`ca-status-dot ${isConnected ? 'ca-status-dot--online' : ''}`} />
            <span>{isConnected ? 'Digital Assistant · Online' : 'Connecting…'}</span>
          </div>
        </div>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div className="ca-error-banner">⚠ {error}</div>
      )}

      {/* ── Messages ── */}
      <Transcript
        messages={messages}
        isTyping={isTyping}
        onSuggestion={onSuggestion}
      />

      {/* ── Input ── */}
      <InputBar onSend={onSend} disabled={!isConnected} />

      {/* ── Footer ── */}
      <div className="ca-footer">
        Powered by <span>ZILLIONe</span> · Microsoft Copilot Studio
      </div>
    </div>
  )
}