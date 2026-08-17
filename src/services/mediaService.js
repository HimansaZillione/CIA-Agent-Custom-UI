// mediaService.js
// Fetches product media manifest from Azure Function endpoint.
// Function reads manifest.json from Blob + returns SAS URLs.
import { MEDIA_URL } from '../config/botConfig'

export async function fetchProductMedia() {
  const res = await fetch(MEDIA_URL)
  if (!res.ok) throw new Error('Failed to fetch product media')
  return res.json()
}