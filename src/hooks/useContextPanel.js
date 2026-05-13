import { useState, useCallback } from 'react'

export const PANEL = {
  PRODUCT : 'SHOW_PRODUCT',
  FORM    : 'SHOW_FORM',
  INFO    : 'SHOW_INFO',
  MAP     : 'SHOW_MAP',
  HRM     : 'SHOW_HRM',
}

export default function useContextPanel() {
  const [panel, setPanel] = useState({ open: false, mode: null, payload: null })

  const openPanel = useCallback((mode, payload = null) => {
    setPanel({ open: true, mode, payload })
  }, [])

  const closePanel = useCallback(() => {
    setPanel(p => ({ ...p, open: false }))
  }, [])

  // Called by useBotConnection when channelData or text signals arrive
  const handleSignal = useCallback((mode, payload, attachments) => {
    if (mode === PANEL.FORM) {
      const card = attachments?.find(a => a.contentType === 'application/vnd.microsoft.card.adaptive')
      openPanel(PANEL.FORM, { ...payload, cardJson: card?.content ?? null })
    } else {
      openPanel(mode, payload)
    }
  }, [openPanel])

  return { panel, openPanel, closePanel, handleSignal }
}
