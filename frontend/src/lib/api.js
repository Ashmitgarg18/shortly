import axios from 'axios'

const BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  `${window.location.origin}/api`

export const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000
})

export async function createShortUrl(payload) {
  // payload: { longUrl, alias?, expirationDate? }
  const res = await api.post('/urls', payload)
  return res.data // { short_url: "..." }
}
