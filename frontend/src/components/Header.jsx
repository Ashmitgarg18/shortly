import ThemeToggle from './ThemeToggle'

export default function Header() {
  return (
    <header className="border-b border-gray-200 dark:border-gray-800 bg-white/70 dark:bg-gray-900/70 backdrop-blur sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="h-7 w-7 rounded-xl bg-brand-600"></div>
          <span className="font-semibold">Short.ly</span>
        </div>
        <div className="flex items-center gap-4">
          <a
            href="#history"
            className="text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
          >
            History
          </a>
          <ThemeToggle />
        </div>
      </div>
    </header>
  )
}
