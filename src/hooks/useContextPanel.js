import { useState, useCallback } from 'react'
import escalateCard from '../config/escalateCard'

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

  const reopenPanel = useCallback(() => {
    setPanel(p => ({ ...p, open: true }))
  }, [])

  // Called by useBotConnection when channelData or text signals arrive
  const handleSignal = useCallback((mode, payload, attachments) => {
    if (mode === PANEL.FORM) {
      // Always use the local escalateCard — field IDs match the Copilot Studio
      // AdaptiveCardPrompt output binding exactly (customerName, Email, etc.)
      // The attachment card from the bot is suppressed on purpose.
      openPanel(PANEL.FORM, {
        ...payload,
        cardJson: escalateCard
      })
      return
    }
    openPanel(mode, payload)
  }, [openPanel])

  return { panel, openPanel, closePanel, reopenPanel, handleSignal }
}
  return { panel, openPanel, closePanel, handleSignal }
}
