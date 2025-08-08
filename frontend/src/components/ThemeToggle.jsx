import { useEffect, useState } from 'react'

const storageKey = 'shortly.theme' // 'light' | 'dark' | 'system'

function applyTheme(next) {
  const root = document.documentElement
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  const isDark = next === 'dark' || (next === 'system' && prefersDark)
  root.classList.toggle('dark', isDark)
}

export default function ThemeToggle() {
  const [mode, setMode] = useState(localStorage.getItem(storageKey) || 'system')

  useEffect(() => {
    applyTheme(mode)
    localStorage.setItem(storageKey, mode)
  }, [mode])

  return (
    <div className="flex items-center gap-1 text-sm">
      <button
        title="Light"
        onClick={() => setMode('light')}
        className={`px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
          mode === 'light' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'
        }`}
      >
        ☀️
      </button>
      <button
        title="System"
        onClick={() => setMode('system')}
        className={`px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
          mode === 'system' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'
        }`}
      >
        💻
      </button>
      <button
        title="Dark"
        onClick={() => setMode('dark')}
        className={`px-2 py-1 rounded-md border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 ${
          mode === 'dark' ? 'bg-gray-100 dark:bg-gray-800' : 'bg-transparent'
        }`}
      >
        🌙
      </button>
    </div>
  )
}
