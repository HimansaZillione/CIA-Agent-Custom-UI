// topics.js
// Topic phrases the UI can send. Each phrase must match a trigger phrase in Copilot Studio.

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

// Home-screen intent cards. `message` is what gets sent to the bot.
// "Book a call" reuses the escalation phrase so it works with today's topics;
// the other messages need trigger phrases (or generative answers) in Copilot Studio.
export const HOME_INTENTS = [
  { id: 'choose',   icon: 'compass',  label: 'Help me choose the right solution for my business', message: 'Help me choose the right solution for my business' },
  { id: 'compare',  icon: 'scale',    label: 'Compare two solutions',                            message: 'Compare two solutions' },
  { id: 'cost',     icon: 'dollar',   label: 'What does a project like this typically cost?',    message: 'What does a project like this typically cost?' },
  { id: 'problem',  icon: 'help',     label: "I have a problem and I'm not sure what I need",   message: "I have a problem and I'm not sure what I need" },
  { id: 'call',     icon: 'calendar', label: 'Book a call with a consultant',                    message: HUMAN_AGENT_PHRASE },
  { id: 'support',  icon: 'headset',  label: "I'm an existing customer and need support",       message: "I'm an existing customer and need support" },
]