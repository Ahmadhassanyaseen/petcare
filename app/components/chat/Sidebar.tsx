import React from 'react'

const Sidebar = () => {
  return (
    <div className="p-4">
      <h3 className="font-semibold text-gray-800 mb-3">Navigation</h3>
      <div className="space-y-2">
        <button className="w-full text-left p-3 rounded-lg bg-blue-50 text-blue-700 font-medium">
          🏠 Dashboard
        </button>
        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700">
          💬 All Chats
        </button>
        <button className="w-full text-left p-3 rounded-lg hover:bg-gray-50 text-gray-700">
          ⚙️ Settings
        </button>
      </div>
    </div>
  )
}

export default Sidebar