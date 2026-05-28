import { useState, useCallback } from 'react'
import useBotConnection from '../hooks/useBotConnection'
import useSidebar from '../hooks/useSidebar'
import LauncherButton from './LauncherButton'
import ChatPanel from './ChatPanel'
import ContextSidebar from '../sidebar/ContextSidebar'

export default function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)

  const { sidebar, closeSidebar, handleSidebarSignal } = useSidebar()

  const {
    messages,
    isTyping,
    isConnected,
    error,
    init,
    sendMessage,
    submitCard,
  } = useBotConnection({ onSidebarSignal: handleSidebarSignal })

  const openWidget = useCallback(() => {
    setIsOpen(true)
    init() // no-op if already initialised
  }, [init])

  const closeWidget = useCallback(() => {
    setIsOpen(false)
    closeSidebar()
  }, [closeSidebar])

  const handleSuggestion = useCallback((text) => {
    sendMessage(text)
  }, [sendMessage])

  return (
    <>
      {/* Floating launcher button */}
      <LauncherButton isOpen={isOpen} onClick={isOpen ? closeWidget : openWidget} />

      {/* Chat widget panel */}
      {isOpen && (
        <div className="ca-widget-shell">
          <ChatPanel
            messages={messages}
            isTyping={isTyping}
            isConnected={isConnected}
            error={error}
            onSend={sendMessage}
            onSuggestion={handleSuggestion}
          />

          {/* Context sidebar — slides in from the right edge of the widget */}
          <ContextSidebar
            sidebar={sidebar}
            onClose={closeSidebar}
            onSubmitCard={submitCard}
            onSuggestion={handleSuggestion}
          />
        </div>
      )}
    </>
  )
}