// embedBridge.js
// Talks to the host page (public/embed.js) when the app runs inside the website iframe.

export const isEmbedded = (() => {
  try { return window.self !== window.top } catch { return true }
})()

// type: 'close' | 'collapse' | 'expand'
// Target origin is '*' because the widget is embedded on several host sites; the
// message carries no data. embed.js verifies the sender's origin and source window.
export function postToHost(type) {
  if (!isEmbedded) return
  window.parent.postMessage({ source: 'askzillione', type }, '*')
}