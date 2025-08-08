import { QRCodeCanvas } from 'qrcode.react'
import CopyButton from './CopyButton.jsx'

export default function ResultCard({ result }) {
  const url = result.short_url

  return (
    <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl p-5 shadow-sm">
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="min-w-0">
          <div className="text-sm text-gray-500 dark:text-gray-400">Your short link</div>
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="block font-medium text-lg text-brand-700 truncate hover:underline"
            title={url}
          >
            {url}
          </a>
        </div>

        <div className="flex items-center gap-3">
          <CopyButton text={url} />
          <a
            href={url}
            target="_blank"
            rel="noreferrer"
            className="px-3 py-2 text-sm rounded-md bg-gray-900 text-white dark:bg-white dark:text-gray-900"
          >
            Open
          </a>
        </div>
      </div>

      <div className="mt-4 flex items-center gap-4">
        <div className="rounded-xl border border-gray-200 dark:border-gray-700 p-3 bg-white dark:bg-gray-900">
          <QRCodeCanvas value={url} size={112} includeMargin />
        </div>
        <p className="text-sm text-gray-600 dark:text-gray-300">
          Scan this QR to open the link on mobile. Right-click to save the QR.
        </p>
      </div>
    </div>
  )
}
