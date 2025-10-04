"use client"

import React, { useState, useEffect } from 'react'
import { useRouter, usePathname } from 'next/navigation'
// import Header from './Header'

interface ChatSession {
  id: string
  title?: string
  createdAt: string
  lastMessage?: string
  messageCount?: number
}

interface ChatLayoutProps {
  children: React.ReactNode
  onNewChat?: () => void
}

const ChatLayout: React.FC<ChatLayoutProps> = ({ children, onNewChat }) => {
  const router = useRouter()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadChatSessions()
  }, [])

  const loadChatSessions = async () => {
    if (typeof window === 'undefined') return

    try {
      const response = await fetch('/api/chat/sessions')
      if (response.ok) {
        const sessions = await response.json()
        setChatSessions(sessions)
      }
    } catch (err) {
      console.error('Failed to load chat sessions:', err)
    } finally {
      setLoading(false)
    }
  }

  const isChatPage = pathname === '/chat'
  const isIndividualChatPage = pathname.startsWith('/chat/') && pathname !== '/chat'

  return (
    <>
    {/* <Header /> */}
    <div className="font-sans text-gray-800 min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="flex h-screen">
        {/* Sidebar */}
        <div className={`
          ${sidebarOpen ? 'w-80' : 'w-0 md:w-80'}
          bg-white shadow-xl transition-all duration-300 ease-in-out overflow-hidden
          border-r border-gray-200 flex flex-col fixed md:relative z-50 md:z-auto h-full
        `}>
          {/* Sidebar Header */}
          <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-blue-600 to-purple-600">
            <div className="flex items-center justify-between text-white">
              <h2 className="text-lg font-semibold">Chat History</h2>
              <button
                onClick={() => setSidebarOpen(false)}
                className="md:hidden p-1 hover:bg-white/20 rounded transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Chat Sessions List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            ) : chatSessions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                <svg className="w-12 h-12 mx-auto mb-3 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <p className="text-sm">No chat sessions yet</p>
                <p className="text-xs mt-1">Start a conversation to see it here</p>
              </div>
            ) : (
              chatSessions.map((session) => (
                <div
                  key={session.id}
                  className={`
                    p-3 rounded-lg cursor-pointer transition-all duration-200 hover:shadow-md
                    ${pathname === `/chat/${session.id}`
                      ? 'bg-blue-50 border border-blue-200 shadow-sm'
                      : 'bg-gray-50 hover:bg-gray-100 border border-transparent'
                    }
                  `}
                  onClick={() => {
                    if (pathname !== `/chat/${session.id}`) {
                      router.push(`/chat/${session.id}`)
                      setSidebarOpen(false)
                    }
                  }}
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="font-medium text-gray-900 text-sm truncate flex-1">
                      {session.title || `Session ${session.id.slice(-8)}`}
                    </h3>
                    <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                      {new Date(session.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 line-clamp-2">
                    {session.lastMessage || 'No messages yet'}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">
                      {session.messageCount || 0} messages
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Sidebar Footer */}
          <div className="p-4 border-t border-gray-200 fixed bottom-0 w-80 space-y-2">
            {onNewChat && (
              <button
                onClick={() => {
                  onNewChat()
                  setSidebarOpen(false)
                }}
                className=" w-full py-2 px-4 rounded-lg font-medium transition-colors cursor-pointer bg-gradient-to-br from-blue-600 to-purple-600 text-white"
              >
                🎤 New Voice Chat
              </button>
            )}
            
          </div>
        </div>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Mobile Sidebar Toggle */}
          {!sidebarOpen && (
            <div className="md:hidden p-4 border-b border-gray-200 bg-white shadow-sm">
              <button
                onClick={() => setSidebarOpen(true)}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
                <span className="text-sm">Chat History</span>
              </button>
            </div>
          )}

          {/* Page Content */}
          <div className="flex-1 overflow-auto">
            {children}
          </div>
        </div>
      </div>
    </div>
    </>
  )
}

export default ChatLayout
