import { useState, useCallback } from 'react'

// Sidebar modes — must match what Copilot Studio sends in channelData.sidebarAction
export const SIDEBAR_MODES = {
  SHOW_PRODUCT: 'SHOW_PRODUCT',
  SHOW_FORM:    'SHOW_FORM',
  SHOW_INFO:    'SHOW_INFO',
}

export default function useSidebar() {
  const [sidebar, setSidebarState] = useState({
    open: false,
    mode: null,    // one of SIDEBAR_MODES
    payload: null, // { tag } for product, { cardJson } for form, { content } for info
  })

  const openSidebar = useCallback((mode, payload = null) => {
    setSidebarState({ open: true, mode, payload })
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarState(prev => ({ ...prev, open: false }))
  }, [])

  // Called by useBotConnection when it parses channelData from a bot reply
  const handleSidebarSignal = useCallback((channelData, attachments) => {
    const { sidebarAction, payload = {} } = channelData

    if (sidebarAction === SIDEBAR_MODES.SHOW_PRODUCT) {
      openSidebar(SIDEBAR_MODES.SHOW_PRODUCT, payload)
      return
    }

    if (sidebarAction === SIDEBAR_MODES.SHOW_FORM) {
      // The adaptive card may be attached directly on the same activity
      const cardAttachment = attachments?.find(
        a => a.contentType === 'application/vnd.microsoft.card.adaptive'
      )
      openSidebar(SIDEBAR_MODES.SHOW_FORM, {
        ...payload,
        cardJson: cardAttachment?.content ?? null,
      })
      return
    }

    if (sidebarAction === SIDEBAR_MODES.SHOW_INFO) {
      openSidebar(SIDEBAR_MODES.SHOW_INFO, payload)
    }
  }, [openSidebar])

  return { sidebar, openSidebar, closeSidebar, handleSidebarSignal }
}
