export default function LauncherButton({ isOpen, onClick }) {
  return (
    <button
      className={`ca-launcher ${isOpen ? 'ca-launcher--open' : ''}`}
      onClick={onClick}
      aria-label={isOpen ? 'Close assistant' : 'Ask ZILLIONe'}
    >
      {/* Notification dot — shown only when widget is closed */}
      {!isOpen && <span className="ca-launcher__dot" />}

      {/* Closed state: icon + label */}
      {!isOpen && (
        <>
          {/* Chat bubble icon */}
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
            stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            aria-hidden="true">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>

          {/* "Ask ZILLIONe" label — matching the website CTA */}
          <span className="ca-launcher__label">Ask ZILLIONe</span>
        </>
      )}

      {/* Open state: close icon */}
      {isOpen && (
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
          stroke="white" strokeWidth="2.5" strokeLinecap="round"
          aria-hidden="true">
          <line x1="18" y1="6" x2="6" y2="18" />
          <line x1="6" y1="6" x2="18" y2="18" />
        </svg>
      )}
    </button>
  )
}