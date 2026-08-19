import React from 'react'

export default function DashboardPage() {
  return (
    <div className="p-6 space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
        <p className="text-gray-600 dark:text-gray-400 mt-1">Vessel Acquisition Analysis Platform</p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-lg p-8 border border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Welcome to VesselIQ</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          A professional platform for analyzing vessel acquisition deals with detailed financial metrics and investor portfolios.
        </p>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Features (Coming Soon)</h3>
          <ul className="list-disc list-inside text-gray-600 dark:text-gray-400 space-y-2">
            <li>Create and manage vessel acquisition portfolios</li>
            <li>Calculate IRR, NPV, MOIC, and payback periods</li>
            <li>Multiple financing scenarios (bank loans, sale & leaseback)</li>
            <li>Investor equity distribution tracking</li>
            <li>Export analysis to PDF and Excel</li>
            <li>Sensitivity analysis and scenario modeling</li>
          </ul>
        </div>
      </div>
    </div>
  )
}
