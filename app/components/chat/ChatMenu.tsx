import Link from 'next/link';
import React, { useState } from 'react'
import { useRouter } from 'next/navigation';

const ChatMenu = () => {
    const router = useRouter();
      const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false);
      const logout = ()=>{
        localStorage.removeItem("user_data");
        router.push("/");
      }
  return (
    <div className="absolute top-6 right-6 z-50">
    <div className="relative">
      <button
        onClick={() => setIsMenuOpen(!isMenuOpen)}
        className="group flex items-center space-x-3 bg-gradient-to-br from-blue-600 to-purple-600 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
      >
        <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300">
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </div>
        <span className="text-sm font-semibold tracking-wide">
          Menu
        </span>
      </button>

      {isMenuOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-60">
          <Link
            href="/"
            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            Home
          </Link>
          <Link
            href="/profile"
            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Profile
          </Link>
          <Link
            href="/chat"
            className="flex items-center px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              />
            </svg>
            Chat
          </Link>
          <button
            onClick={() => {
              // Handle logout logic here
              logout();
            }}
            className="flex items-center w-full px-4 py-2 text-gray-800 hover:bg-gray-100 transition-colors duration-200"
          >
            <svg
              className="w-4 h-4 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              />
            </svg>
            Logout
          </button>
        </div>
      )}
    </div>
  </div>
  )
}

export default ChatMenu