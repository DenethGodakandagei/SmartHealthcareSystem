"use client"
import React from 'react'
import { StethoscopeIcon, BellIcon } from 'lucide-react'

export default function DashboardLayout({ children, sidebarItems, title, userName, userRole }) {
  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col">
        {/* Logo */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 bg-green-500 flex items-center justify-center rounded-lg">
              <StethoscopeIcon size={22} className="text-white" />
            </div>
            <span className="font-bold text-lg text-gray-700">MedConnect</span>
          </div>
        </div>

        {/* Sidebar Navigation */}
        <div className="flex-1 py-6 px-3">
          <h2 className="text-xs uppercase text-gray-400 font-semibold px-3 mb-4">Main Menu</h2>
          <nav className="space-y-1">
            {sidebarItems.map((item, index) => (
              <button
                key={index}
                onClick={item.onClick}
                className={`
                  w-full flex items-center gap-3 px-3 py-2 text-gray-600 rounded-lg
                  hover:bg-green-100 hover:text-green-600 transition
                  ${item.active ? 'bg-green-100 text-green-600 font-medium' : ''}
                `}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 py-4 px-6 flex justify-between items-center shadow-sm">
          <h1 className="text-2xl font-semibold text-green-600 flex items-center gap-2">
            <StethoscopeIcon size={24} />
            {title}
          </h1>

          <div className="flex items-center gap-4">
            {/* Notifications */}
            <button className="relative p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition">
              <BellIcon size={18} className="text-gray-600" />
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-red-500 rounded-full animate-pulse"></span>
            </button>

            {/* User Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                {userName.split(' ').map(name => name[0]).join('')}
              </div>
              <div className="flex flex-col">
                <p className="text-sm font-medium text-gray-700">{userName}</p>
                <p className="text-xs text-gray-400">{userRole}</p>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto p-6 bg-gray-50">
          {children}
        </main>
      </div>
    </div>
  )
}
