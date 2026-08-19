import React, { useState } from 'react'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export const API_BASE = '/api'

function App() {
  const [isDark, setIsDark] = useState(false)

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <div className="flex h-screen bg-white dark:bg-gray-900">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} />
          <main className="flex-1 overflow-auto">
            <DashboardPage />
          </main>
        </div>
      </div>
    </div>
  )
}

export default App
