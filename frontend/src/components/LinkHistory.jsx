import { loadHistory } from '../lib/storage'
import CopyButton from './CopyButton'
import { useEffect, useState } from 'react'

export default function LinkHistory({ onUse }) {
  const [items, setItems] = useState([])

  useEffect(() => {
    setItems(loadHistory())
  }, [])

  if (!items.length) return (
    <div id="history" className="text-gray-500 dark:text-gray-400 text-sm">
      No history yet. Create a short link to see it here.
    </div>
  )

  return (
    <div id="history" className="space-y-4">
      <h2 className="text-lg font-semibold">Recent links</h2>
      <ul className="grid md:grid-cols-2 gap-4">
        {items.map((it, idx) => (
          <li key={idx} className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl p-4 shadow-sm">
            <div className="text-sm text-gray-500 dark:text-gray-400">Short link</div>
            <a href={it.shortUrl} target="_blank" rel="noreferrer"
               className="font-medium text-brand-700 hover:underline break-all">
              {it.shortUrl}
            </a>

            <div className="mt-2 text-sm text-gray-600 dark:text-gray-300 break-all">
              <span className="text-gray-500 dark:text-gray-400">Target:</span> {it.longUrl}
            </div>

            {it.alias && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Alias:</span> {it.alias}
              </div>
            )}

            {it.expirationDate && (
              <div className="text-sm text-gray-600 dark:text-gray-300">
                <span className="text-gray-500 dark:text-gray-400">Expires:</span>{' '}
                {new Date(it.expirationDate).toLocaleString()}
              </div>
            )}

            <div className="mt-3 flex items-center gap-2">
              <CopyButton text={it.shortUrl} />
              <button
                onClick={() => onUse?.(it.shortUrl)}
                className="px-3 py-2 text-sm rounded-md border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Use
              </button>
              <a
                href={it.shortUrl}
                target="_blank"
                rel="noreferrer"
                className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900"
              >
                Open
              </a>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
