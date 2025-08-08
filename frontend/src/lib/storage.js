const KEY = 'shortly.history.v1'

export function loadHistory() {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

export function saveHistory(list) {
  localStorage.setItem(KEY, JSON.stringify(list))
}

export function pushHistory(item) {
  const list = loadHistory()
  list.unshift(item)
  // cap to last 25 items
  saveHistory(list.slice(0, 25))
}
