import { useMutation } from '@tanstack/react-query'
import { createShortUrl } from '../lib/api'
import { pushHistory } from '../lib/storage'
import { toLocalDatetimeInputValue, toISOStringIfValue } from '../lib/format'
import { useState } from 'react'

export default function UrlForm({ onCreated }) {
  const [longUrl, setLongUrl] = useState('')
  const [alias, setAlias] = useState('')
  const [expiry, setExpiry] = useState('')

  const mutation = useMutation({
    mutationFn: async () => {
      const payload = {
        longUrl: longUrl.trim(),
        alias: alias.trim() || undefined,
        expirationDate: toISOStringIfValue(expiry)
      }
      return await createShortUrl(payload)
    },
    onSuccess: (data) => {
      onCreated?.(data)
      pushHistory({
        longUrl,
        alias: alias || null,
        expirationDate: expiry || null,
        shortUrl: data.short_url,
        createdAt: new Date().toISOString()
      })
      setAlias('')
    }
  })

  const onSubmit = (e) => {
    e.preventDefault()
    if (!longUrl) return
    mutation.mutate()
  }

  const errorText = mutation.isError
    ? (mutation.error?.response?.data?.error ||
       (mutation.error?.response?.data?.errors && JSON.stringify(mutation.error.response.data.errors)) ||
       mutation.error?.message || 'Something went wrong')
    : ''

  return (
    <form
      onSubmit={onSubmit}
      className="bg-white dark:bg-gray-800 shadow-sm rounded-2xl p-5 border border-gray-200 dark:border-gray-700 space-y-4"
    >
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-gray-700 dark:text-gray-200">Long URL</label>
        <input
          type="url"
          placeholder="https://example.com/super/long/path?with=params"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          required
          className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-600"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Custom alias (optional)
          </label>
          <input
            type="text"
            placeholder="e.g., launch-aug"
            value={alias}
            onChange={(e) => setAlias(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-600"
            pattern="^[a-zA-Z0-9_-]*$"
            maxLength={10}
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Letters, numbers, “_”, “-”. Up to 10 chars.
          </p>
        </div>

        <div className="space-y-1.5">
          <label className="text-sm font-medium text-gray-700 dark:text-gray-200">
            Expiration (optional)
          </label>
          <input
            type="datetime-local"
            min={toLocalDatetimeInputValue()}
            value={expiry}
            onChange={(e) => setExpiry(e.target.value)}
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 px-3 py-2 outline-none focus:ring-2 focus:ring-brand-600"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Leave empty for no expiration.
          </p>
        </div>
      </div>

      {errorText && (
        <div className="text-sm text-red-600 bg-red-50 dark:text-red-400 dark:bg-red-950/40 border border-red-200 dark:border-red-900 rounded-md p-2">
          {errorText}
        </div>
      )}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={mutation.isPending}
          className="inline-flex items-center justify-center rounded-lg bg-brand-600 hover:bg-brand-700 text-white px-4 py-2 font-medium disabled:opacity-60"
        >
          {mutation.isPending ? 'Shortening…' : 'Shorten URL'}
        </button>

        <button
          type="button"
          className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          onClick={() => {
            setLongUrl('')
            setAlias('')
            setExpiry('')
          }}
        >
          Clear
        </button>
      </div>
    </form>
  )
}
