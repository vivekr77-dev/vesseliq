import React, { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import axios from 'axios'
import LoginPage from './pages/LoginPage'
import DashboardPage from './pages/DashboardPage'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'

export const API_BASE = '/api'

function App() {
  const [isDark, setIsDark] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(localStorage.getItem('token'))
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (token) {
      setIsAuthenticated(true)
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(userData)
    }
    setIsLoading(false)
  }, [token])

  const handleLogin = async (username, password) => {
    try {
      const response = await axios.post(`${API_BASE}/auth/login`, { username, password })
      const { token, user } = response.data
      localStorage.setItem('token', token)
      localStorage.setItem('user', JSON.stringify(user))
      setToken(token)
      setUser(user)
      setIsAuthenticated(true)
      return { success: true }
    } catch (error) {
      return { success: false, error: error.response?.data?.error || 'Login failed' }
    }
  }

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    setToken(null)
    setUser(null)
    setIsAuthenticated(false)
  }

  const toggleDarkMode = () => {
    setIsDark(!isDark)
    if (!isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen bg-white dark:bg-gray-900">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-blue-600">VesselIQ</h1>
          <p className="text-gray-500 mt-2">Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={isDark ? 'dark' : ''}>
      <BrowserRouter>
        {isAuthenticated ? (
          <div className="flex h-screen bg-white dark:bg-gray-900">
            <Sidebar onLogout={handleLogout} />
            <div className="flex-1 flex flex-col">
              <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} user={user} onLogout={handleLogout} />
              <main className="flex-1 overflow-auto">
                <Routes>
                  <Route path="/" element={<DashboardPage />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </main>
            </div>
          </div>
        ) : (
          <Routes>
            <Route path="/login" element={<LoginPage onLogin={handleLogin} />} />
            <Route path="*" element={<Navigate to="/login" />} />
          </Routes>
        )}
      </BrowserRouter>
    </div>
  )
}

export default App
