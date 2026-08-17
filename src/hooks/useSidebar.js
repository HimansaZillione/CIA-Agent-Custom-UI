import { useState, useCallback } from 'react'

export const SIDEBAR_MODES = {
  SHOW_PRODUCT: 'SHOW_PRODUCT',
  SHOW_FORM:    'SHOW_FORM',
  SHOW_INFO:    'SHOW_INFO',
  SHOW_MAP:     'SHOW_MAP',
}

export default function useSidebar() {
  const [sidebar, setSidebarState] = useState({
    open:    false,
    mode:    null,
    payload: null,
  })

  const openSidebar = useCallback((mode, payload = null) => {
    setSidebarState({ open: true, mode, payload })
  }, [])

  const closeSidebar = useCallback(() => {
    setSidebarState(prev => ({ ...prev, open: false }))
  }, [])

  // Called by useBotConnection when it parses signals from bot replies
  // SHOW_PRODUCT no longer opens the sidebar — it's handled by MediaPanel
  const handleSidebarSignal = useCallback((action, payload = {}, attachments = []) => {

    if (action === SIDEBAR_MODES.SHOW_MAP) {
      openSidebar(SIDEBAR_MODES.SHOW_MAP)
      return
    }

    if (action === SIDEBAR_MODES.SHOW_FORM) {
      const cardAttachment = attachments?.find(
        a => a.contentType === 'application/vnd.microsoft.card.adaptive'
      )
      openSidebar(SIDEBAR_MODES.SHOW_FORM, {
        ...payload,
        cardJson: cardAttachment?.content ?? null,
      })
      return
    }

    if (action === SIDEBAR_MODES.SHOW_INFO) {
      openSidebar(SIDEBAR_MODES.SHOW_INFO, payload)
      return
    }

    // SHOW_PRODUCT — sidebar stays closed, MediaPanel handles this via activeProduct
  }, [openSidebar])

  return { sidebar, openSidebar, closeSidebar, handleSidebarSignal }
}