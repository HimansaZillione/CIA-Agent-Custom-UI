export default function LauncherButton({ isOpen, onClick }) {
  return (
    <button
      className={`ca-launcher ${isOpen ? 'ca-launcher--open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close assistant' : 'Open assistant'}
    >
      {/* Notification dot — shown when widget is closed */}
      {!isOpen && <span className="ca-launcher__dot" />}

      {/* Chat icon */}
      {!isOpen && (
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
      )}

      {/* Close icon */}
      {isOpen && (
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
    </button>
  )
}
