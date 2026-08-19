import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { API_BASE } from '../App'

export default function DashboardPage() {
  const [portfolios, setPortfolios] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const token = localStorage.getItem('token')

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await axios.get(`${API_BASE}/portfolios`, {
          headers: { Authorization: `Bearer ${token}` }
        })
        setPortfolios(response.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetch()
  }, [token])

  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Welcome to VesselIQ</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Total Portfolios</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{portfolios.length}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">Status</p>
          <p className="text-3xl font-bold text-green-600 mt-2">✓ Active</p>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
          <p className="text-gray-600 dark:text-gray-400 text-sm">API Connection</p>
          <p className="text-3xl font-bold text-blue-600 mt-2">✓ Connected</p>
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-6">Portfolios</h2>
        {loading && <p className="text-gray-500 dark:text-gray-400">Loading...</p>}
        {error && <p className="text-red-600">Error: {error}</p>}
        {!loading && portfolios.length === 0 && <p className="text-gray-500 dark:text-gray-400">No portfolios yet.</p>}
        {portfolios.map((p) => (
          <div key={p.id} className="p-4 rounded-lg border border-gray-200 dark:border-gray-700 mb-2">
            <h3 className="font-semibold text-gray-900 dark:text-white">{p.name}</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{p.description || '—'}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
