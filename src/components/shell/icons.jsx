// icons.jsx — inline stroke icons (inherit currentColor)

const base = {
  viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor',
  strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round',
  'aria-hidden': true, focusable: 'false',
}

export const IconGrid = () => (
  <svg {...base}>
    <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
    <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
    <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
  </svg>
)

export const IconBriefcase = () => (
  <svg {...base}>
    <rect x="3" y="7" width="18" height="13" rx="2" />
    <path d="M8.5 7V5.5a2 2 0 0 1 2-2h3a2 2 0 0 1 2 2V7" />
    <path d="M3 12.5h18" />
    <rect x="10.5" y="11" width="3" height="3" rx=".6" />
  </svg>
)

export const IconShield = () => (
  <svg {...base}>
    <path d="M12 3l7.5 3v5.5c0 4.6-3.2 8.4-7.5 9.5-4.3-1.1-7.5-4.9-7.5-9.5V6L12 3z" />
    <path d="M8.8 12.2l2.2 2.2 4.3-4.6" />
  </svg>
)

export const IconHeadset = () => (
  <svg {...base}>
    <path d="M4.5 14v-2a7.5 7.5 0 0 1 15 0v2" />
    <rect x="3" y="13.5" width="4" height="6" rx="1.6" />
    <rect x="17" y="13.5" width="4" height="6" rx="1.6" />
    <path d="M19 19.5c0 1.2-1.6 2-3.8 2H13" />
  </svg>
)

export const IconUser = () => (
  <svg {...base}>
    <circle cx="12" cy="8" r="4" />
    <path d="M4.5 20.5c.6-3.9 3.7-6.5 7.5-6.5s6.9 2.6 7.5 6.5" />
  </svg>
)

export const IconCollapse = () => (
  <svg {...base}>
    <path d="M20 4l-6 6M14 10h5M14 10V5" />
    <path d="M4 20l6-6M10 14H5M10 14v5" />
  </svg>
)

export const IconExpand = () => (
  <svg {...base}>
    <path d="M14 10l6-6M20 4h-5M20 4v5" />
    <path d="M10 14l-6 6M4 20h5M4 20v-5" />
  </svg>
)

export const IconClose = () => (
  <svg {...base} strokeWidth={2}>
    <path d="M6 6l12 12M18 6L6 18" />
  </svg>
)

export const IconSend = () => (
  <svg {...base} stroke="white" strokeWidth={2.2}>
    <path d="M22 2L11 13" />
    <path d="M22 2l-7 20-4-9-9-4 20-7z" />
  </svg>
)

export const RAIL_ICONS = {
  grid:      IconGrid,
  briefcase: IconBriefcase,
  shield:    IconShield,
  headset:   IconHeadset,
}

// ── Home-screen intent icons ──────────────────────────────────────────────
export const IconCompass = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M15.5 8.5l-2 5-5 2 2-5 5-2z" />
  </svg>
)

export const IconScale = () => (
  <svg {...base}>
    <path d="M12 4v16M8 20h8M5 7h14" />
    <path d="M5 7l-2.5 6a3 3 0 0 0 5 0L5 7zM19 7l-2.5 6a3 3 0 0 0 5 0L19 7z" />
  </svg>
)

export const IconDollar = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="9" />
    <path d="M14.8 9.2c-.4-.9-1.5-1.5-2.8-1.5-1.6 0-2.8.9-2.8 2.1 0 2.8 5.6 1.4 5.6 4.3 0 1.2-1.2 2.1-2.8 2.1-1.4 0-2.5-.6-2.9-1.6M12 6v1.7M12 16.3V18" />
  </svg>
)

export const IconHelp = () => (
  <svg {...base}>
    <path d="M12 21a9 9 0 1 0-8.1-5.1L3 21l5.1-.9A9 9 0 0 0 12 21z" />
    <path d="M9.6 9.4a2.5 2.5 0 0 1 4.8.9c0 1.7-2.4 2.1-2.4 3.4M12 16.6h.01" />
  </svg>
)

export const IconCalendar = () => (
  <svg {...base}>
    <rect x="3.5" y="5" width="17" height="15.5" rx="2" />
    <path d="M3.5 10h17M8 3v4M16 3v4" />
    <path d="M8 14h.01M12 14h.01M16 14h.01M8 17h.01M12 17h.01" />
  </svg>
)

export const IconChevronRight = () => (
  <svg {...base} strokeWidth={2}>
    <path d="M9 6l6 6-6 6" />
  </svg>
)

export const INTENT_ICONS = {
  compass:  IconCompass,
  scale:    IconScale,
  dollar:   IconDollar,
  help:     IconHelp,
  calendar: IconCalendar,
  headset:  IconHeadset,
}
// ── Sidebar / challenge icons (keys come from the UI Config topic) ─────────
export const IconBulb = () => (
  <svg {...base}>
    <path d="M9 18h6M10 21h4" />
    <path d="M12 3a6 6 0 0 0-3.6 10.8c.7.6 1.1 1.3 1.1 2.2h5c0-.9.4-1.6 1.1-2.2A6 6 0 0 0 12 3z" />
  </svg>
)

export const IconGear = () => (
  <svg {...base}>
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.8l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.8-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1.1-1.5 1.7 1.7 0 0 0-1.8.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.8 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.5-1.1 1.7 1.7 0 0 0-.3-1.8l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.8.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.8-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.8V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z" />
  </svg>
)

export const IconChart = () => (
  <svg {...base}>
    <path d="M4 20h16" />
    <rect x="5.5" y="11" width="3" height="6.5" rx=".6" />
    <rect x="10.5" y="7" width="3" height="10.5" rx=".6" />
    <rect x="15.5" y="4" width="3" height="13.5" rx=".6" />
  </svg>
)

export const IconLink = () => (
  <svg {...base}>
    <path d="M10 14a4.5 4.5 0 0 0 6.4 0l3-3a4.5 4.5 0 0 0-6.4-6.4l-1 1" />
    <path d="M14 10a4.5 4.5 0 0 0-6.4 0l-3 3a4.5 4.5 0 0 0 6.4 6.4l1-1" />
  </svg>
)

export const IconDatabase = () => (
  <svg {...base}>
    <ellipse cx="12" cy="5.5" rx="7.5" ry="2.8" />
    <path d="M4.5 5.5v13c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8v-13" />
    <path d="M4.5 12c0 1.5 3.4 2.8 7.5 2.8s7.5-1.3 7.5-2.8" />
  </svg>
)

export const IconSparkle = () => (
  <svg {...base}>
    <path d="M10 3.5l1.6 4.4 4.4 1.6-4.4 1.6L10 15.5l-1.6-4.4L4 9.5l4.4-1.6L10 3.5z" />
    <path d="M17.5 14l.8 2.2 2.2.8-2.2.8-.8 2.2-.8-2.2-2.2-.8 2.2-.8.8-2.2z" />
  </svg>
)

export const IconUsers = () => (
  <svg {...base}>
    <circle cx="9" cy="8" r="3.5" />
    <path d="M2.5 20c.5-3.4 3.2-5.5 6.5-5.5s6 2.1 6.5 5.5" />
    <path d="M16 4.6a3.5 3.5 0 0 1 0 6.8M18 14.8c2 .7 3.3 2.5 3.6 5.2" />
  </svg>
)

export const IconList = () => (
  <svg {...base}>
    <rect x="4" y="3" width="16" height="18" rx="2" />
    <path d="M8 8h8M8 12h8M8 16h5" />
  </svg>
)

export const IconImage = () => (
  <svg {...base}>
    <rect x="3" y="4" width="18" height="16" rx="2" />
    <circle cx="8.5" cy="9.5" r="1.8" />
    <path d="M21 16l-5.5-5.5L5 20" />
  </svg>
)

export const IconCloud = () => (
  <svg {...base}>
    <path d="M7 18.5a4.5 4.5 0 0 1-.6-9A6 6 0 0 1 18 8.5a4.5 4.5 0 0 1-.5 10H7z" />
  </svg>
)

export const IconCode = () => (
  <svg {...base}>
    <path d="M8.5 7L3.5 12l5 5M15.5 7l5 5-5 5M13.5 4.5l-3 15" />
  </svg>
)

export const IconChat = () => (
  <svg {...base}>
    <path d="M20.5 12a8.5 8.5 0 0 1-12.6 7.4L3.5 20.5l1.1-4.2A8.5 8.5 0 1 1 20.5 12z" />
  </svg>
)

export const IconPlus = () => (
  <svg {...base} strokeWidth={2}>
    <path d="M12 5v14M5 12h14" />
  </svg>
)

export const IconChevronLeft = () => (
  <svg {...base} strokeWidth={2}>
    <path d="M15 6l-6 6 6 6" />
  </svg>
)

// Any icon key the UI Config topic may send. Unknown keys fall back to IconBulb.
export const UI_ICONS = {
  bulb: IconBulb, gear: IconGear, chart: IconChart, link: IconLink,
  database: IconDatabase, sparkle: IconSparkle, shield: IconShield, users: IconUsers,
  list: IconList, image: IconImage, person: IconUser, briefcase: IconBriefcase,
  cloud: IconCloud, headset: IconHeadset, code: IconCode, chat: IconChat,
}
export const uiIcon = key => UI_ICONS[key] ?? IconBulb