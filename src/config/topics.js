// topics.js
// Topic phrases the UI can send. Each phrase must match a trigger phrase in Copilot Studio.

// Welcome-screen list (same order and wording as before).
export const SUGGESTED = [
  'Cybersecurity Solutions',
  'Power BI Dashboards & Analytics',
  'Cloud Infrastructure & Azure',
  'Microsoft Dynamics 365',
  'SAGE 300 ERP',
  'AI Bots & Agents',
  'Microsoft 365 & Collaboration',
  'Custom Software Development',
  'Jabra Audio & Video Devices',
  'Speak with a Human Agent',
]

export const HUMAN_AGENT_PHRASE = 'Speak with a Human Agent'

// Left-rail categories. `icon` keys map to RAIL_ICONS in components/shell/icons.jsx.
export const TOPIC_CATEGORIES = [
  {
    id: 'microsoft', label: 'Microsoft Solutions', icon: 'grid',
    topics: [
      'Microsoft 365 & Collaboration',
      'Power BI Dashboards & Analytics',
      'Microsoft Dynamics 365',
      'Cloud Infrastructure & Azure',
    ],
  },
  {
    id: 'business', label: 'ERP & Business Apps', icon: 'briefcase',
    topics: ['SAGE 300 ERP', 'Custom Software Development'],
  },
  {
    id: 'security', label: 'Security & AI', icon: 'shield',
    topics: ['Cybersecurity Solutions', 'AI Bots & Agents'],
  },
  {
    id: 'devices', label: 'Devices & Support', icon: 'headset',
    topics: ['Jabra Audio & Video Devices'],
  },
]

// Returns the category id for an exact topic phrase, or null.
export function categoryForTopic(text) {
  const t = text?.trim().toLowerCase()
  if (!t) return null
  const cat = TOPIC_CATEGORIES.find(c => c.topics.some(p => p.toLowerCase() === t))
  return cat?.id ?? null
}