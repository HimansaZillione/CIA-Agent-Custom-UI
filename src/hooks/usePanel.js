// usePanel.js
// Single source of truth for the right-hand context panel.
// Replaces useSidebar.js + the separate MediaDrawer open/activeProduct state.
//
// The panel is ONE container whose content changes by mode. Switching mode never
// closes and reopens the panel — the content transitions in place.
//
// Mode values are unchanged from the old SIDEBAR_MODES so existing bot signals
// (text tokens and channelData.sidebarAction) keep working.
import { useState, useCallback, useRef } from 'react'

export const PANEL_MODES = {
  SHOW_PRODUCT: 'SHOW_PRODUCT',
  SHOW_FORM:    'SHOW_FORM',
  SHOW_INFO:    'SHOW_INFO',
  SHOW_MAP:     'SHOW_MAP',
}

export default function usePanel() {
  const [panel, setPanel] = useState({ open: false, mode: null, payload: null })

  // Product the visitor closed the panel on — keyword auto-detection won't reopen it.
  const dismissedSlug = useRef(null)

  const openPanel = useCallback((mode, payload = null) => {
    setPanel({ open: true, mode, payload })
  }, [])

  const closePanel = useCallback(() => {
    setPanel(prev => {
      if (prev.mode === PANEL_MODES.SHOW_PRODUCT) {
        dismissedSlug.current = prev.payload?.product?.productSlug ?? null
      }
      return { ...prev, open: false }
    })
  }, [])

  // Reopen with whatever was last shown (content is kept while closed).
  const reopenPanel = useCallback(() => {
    setPanel(prev => (prev.mode ? { ...prev, open: true } : prev))
  }, [])

  // Arrow strip: close if open, otherwise reopen the last content.
  const togglePanel = useCallback(() => {
    setPanel(prev => {
      if (!prev.mode) return prev
      if (prev.open && prev.mode === PANEL_MODES.SHOW_PRODUCT) {
        dismissedSlug.current = prev.payload?.product?.productSlug ?? null
      }
      return { ...prev, open: !prev.open }
    })
  }, [])

  // product: { productSlug, family, category }
  // auto:    true when it came from keyword detection rather than an explicit bot signal
  const showProduct = useCallback((product, { auto = false } = {}) => {
    if (!product?.productSlug) return
    setPanel(prev => {
      // Never replace an open contact form — a half-filled form must not be lost.
      if (prev.open && prev.mode === PANEL_MODES.SHOW_FORM) return prev
      // Respect the visitor closing the panel on this product.
      if (auto && dismissedSlug.current === product.productSlug) return prev
      // Already showing this product — keep state (don't reset the slideshow).
      if (prev.open && prev.mode === PANEL_MODES.SHOW_PRODUCT &&
          prev.payload?.product?.productSlug === product.productSlug) return prev
      if (!auto) dismissedSlug.current = null
      return { open: true, mode: PANEL_MODES.SHOW_PRODUCT, payload: { product } }
    })
  }, [])

  // Signals parsed from bot replies (text tokens / channelData.sidebarAction).
  // SHOW_PRODUCT is resolved against the media manifest in App.jsx, then calls showProduct.
  const handleSignal = useCallback((action, payload = {}, attachments = []) => {
    if (action === PANEL_MODES.SHOW_MAP) {
      openPanel(PANEL_MODES.SHOW_MAP)
      return
    }

    if (action === PANEL_MODES.SHOW_FORM) {
      const cardAttachment = attachments?.find(
        a => a.contentType === 'application/vnd.microsoft.card.adaptive'
      )
      // NOTE: same effective behaviour as before — without a card attachment,
      // cardJson is null and the native fallback form renders.
      openPanel(PANEL_MODES.SHOW_FORM, {
        ...payload,
        cardJson: cardAttachment?.content ?? null,
      })
      return
    }

    if (action === PANEL_MODES.SHOW_INFO) {
      openPanel(PANEL_MODES.SHOW_INFO, payload)
    }
  }, [openPanel])

  return { panel, openPanel, closePanel, reopenPanel, togglePanel, showProduct, handleSignal }
}