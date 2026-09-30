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