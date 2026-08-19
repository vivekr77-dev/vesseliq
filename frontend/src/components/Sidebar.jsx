import React from 'react'
import { Link } from 'react-router-dom'

export default function Sidebar({ onLogout }) {
  return (
    <aside className="w-64 bg-gray-900 text-white h-screen p-6 border-r border-gray-800 flex flex-col">
      <h2 className="text-2xl font-bold mb-8">VesselIQ</h2>
      <nav className="space-y-2 flex-1">
        <Link to="/" className="block px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 font-semibold transition">
          📊 Dashboard
        </Link>
      </nav>
      <div className="pt-8 border-t border-gray-800">
        <p className="text-xs text-gray-400 mb-4">Coming Soon</p>
        <div className="space-y-2 opacity-50">
          <div className="px-4 py-3 rounded-lg text-gray-400">💼 Portfolios</div>
          <div className="px-4 py-3 rounded-lg text-gray-400">📈 Analysis</div>
        </div>
      </div>
    </aside>
  )
}
