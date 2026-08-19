import React from 'react'

export default function Navbar({ isDark, onToggleDarkMode, user, onLogout }) {
  return (
    <nav className="bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4 flex items-center justify-between">
      <div>
        <h1 className="text-xl font-bold text-blue-600">VesselIQ</h1>
      </div>
      <div className="flex items-center gap-4">
        <button onClick={onToggleDarkMode} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition text-lg">
          {isDark ? '☀️' : '🌙'}
        </button>
        <div className="flex items-center gap-3 pl-4 border-l border-gray-200 dark:border-gray-700">
          <div className="text-right">
            <p className="text-sm font-semibold text-gray-900 dark:text-white">{user?.username}</p>
            <p className="text-xs text-gray-500 dark:text-gray-400">Signed in</p>
          </div>
          <button onClick={onLogout} className="text-red-600 hover:text-red-700 font-semibold text-sm">
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}
