import Header from './components/Header.jsx'
import UrlForm from './components/UrlForm.jsx'
import ResultCard from './components/ResultCard.jsx'
import LinkHistory from './components/LinkHistory.jsx'
import Footer from './components/Footer.jsx'
import { useState } from 'react'

export default function App() {
  const [lastResult, setLastResult] = useState(null)

  return (
    <div className="min-h-screen flex flex-col bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100">
      <Header />

      <main className="flex-1">
        <section className="bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-900">
          <div className="max-w-3xl mx-auto px-4 py-10 md:py-14">
            <h1 className="text-3xl md:text-4xl font-semibold tracking-tight">
              Tiny links, big impact.
            </h1>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Paste your long link, add an optional alias or expiry, and we’ll make it sleek.
            </p>

            <div className="mt-6">
              <UrlForm onCreated={setLastResult} />
            </div>

            {lastResult && (
              <div className="mt-6">
                <ResultCard result={lastResult} />
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-gray-200 dark:border-gray-800">
          <div className="max-w-5xl mx-auto px-4 py-10">
            <LinkHistory onUse={(url) => setLastResult({ short_url: url })} />
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
