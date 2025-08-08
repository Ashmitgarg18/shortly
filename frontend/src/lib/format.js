export function toLocalDatetimeInputValue(date = new Date()) {
  // YYYY-MM-DDTHH:mm for <input type="datetime-local">
  const pad = (n) => String(n).padStart(2, '0')
  const y = date.getFullYear()
  const m = pad(date.getMonth() + 1)
  const d = pad(date.getDate())
  const hh = pad(date.getHours())
  const mm = pad(date.getMinutes())
  return `${y}-${m}-${d}T${hh}:${mm}`
}

export function toISOStringIfValue(v) {
  // convert local datetime value to ISO string if present
  if (!v) return undefined
  const dt = new Date(v)
  if (isNaN(dt.getTime())) return undefined
  return dt.toISOString()
}
