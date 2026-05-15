export const TOKEN_URL       = import.meta.env.DEV
  ? 'http://localhost:7071/api/token'  // local dev — Azure Function runs here
  : '/api/token'                        // production — SWA serves it

export const DIRECTLINE_BASE = 'https://directline.botframework.com/v3/directline'
export const POLL_INTERVAL   = 900
export const EMPTY_STREAK    = 6
export const POLL_TIMEOUT    = 60000