// export const TOKEN_URL = import.meta.env.DEV
//   ? 'http://localhost:7071/api/directline-token'   // local dev — Azure Function runs here
//   : 'https://cia-functionapp-2-endpoints-g4fwb8f6aahfd7h0.eastus-01.azurewebsites.net/api/directline-token'  // production

// export const MEDIA_URL = import.meta.env.DEV
//   ? 'http://localhost:7071/api/product-media'      // local dev
//   : 'https://cia-functionapp-2-endpoints-g4fwb8f6aahfd7h0.eastus-01.azurewebsites.net/api/product-media'    // production

export const DIRECTLINE_BASE = 'https://directline.botframework.com/v3/directline'
export const POLL_INTERVAL   = 900
export const EMPTY_STREAK    = 6
export const POLL_TIMEOUT    = 60000

export const TOKEN_URL = 'https://cia-functionapp-2-endpoints-g4fwb8f6aahfd7h0.eastus-01.azurewebsites.net/api/directline-token'

export const MEDIA_URL = 'https://cia-functionapp-2-endpoints-g4fwb8f6aahfd7h0.eastus-01.azurewebsites.net/api/product-media'