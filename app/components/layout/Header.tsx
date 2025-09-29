"use client";

import Link from 'next/link';
import React from 'react'
import { useState, useEffect } from "react";
// import { PiChatCircleDuotone } from 'react-icons/pi';

const Header = () => {
    const [mobileOpen, setMobileOpen] = useState(false);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
      // Check if we're on the client side before accessing localStorage
      if (typeof window !== 'undefined') {
        const userData = localStorage.getItem("user_data");
        const parsedUserData = JSON.parse(userData || "{}");
        console.log(parsedUserData);

        if (parsedUserData && Object.keys(parsedUserData).length > 0) {
          setIsAuthenticated(true);
        }
      }
    }, []);

  return (
    <header className="border-b border-gray-100 sticky top-0 z-50 bg-white/90 backdrop-blur">
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div className="flex items-center justify-between h-16">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#FBAA30] text-white font-bold">V</span>
          <span className="text-xl font-semibold">Vet365</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm">
          <Link href="/" className="hover:text-[#FBAA30] transition-colors">Home</Link>
          <Link href="/#about" className="hover:text-[#FBAA30] transition-colors">About</Link>
          <Link href="/#services" className="hover:text-[#FBAA30] transition-colors">Services</Link>
          <Link href="/#contact" className="hover:text-[#FBAA30] transition-colors">Contact</Link>

          {/* Show different links based on authentication status */}
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="hover:text-[#FBAA30] transition-colors">Login</Link>
              <Link href="/signup" className="hover:text-[#FBAA30] transition-colors">Signup</Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white font-semibold shadow bg-gradient-to-r from-[#FBAA30] to-[#ff8a1e] hover:from-[#FBAA30] hover:to-[#FBAA30] transition-all hover:scale-105"
              >
                Profile
              </Link>
              <Link
                href="/chat"
                className="inline-flex items-center justify-center rounded-full px-5 py-2.5 text-white font-semibold shadow bg-gradient-to-r from-[#FBAA30] to-[#ff8a1e] hover:from-[#FBAA30] hover:to-[#FBAA30] transition-all hover:scale-105"
              >
               Chat
              </Link>
              
            </>
          )}
        </nav>

        {/* Mobile toggle */}
        <button
          aria-label="Toggle Menu"
          className="md:hidden inline-flex items-center justify-center rounded-md p-2 text-gray-600 hover:bg-gray-100"
          onClick={() => setMobileOpen((v) => !v)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="h-6 w-6"
          >
            {mobileOpen ? (
              <path
                fillRule="evenodd"
                d="M5.47 5.47a.75.75 0 011.06 0L12 10.94l5.47-5.47a.75.75 0 111.06 1.06L13.06 12l5.47 5.47a.75.75 0 11-1.06 1.06L12 13.06l-5.47 5.47a.75.75 0 01-1.06-1.06L10.94 12 5.47 6.53a.75.75 0 010-1.06z"
                clipRule="evenodd"
              />
            ) : (
              <path
                fillRule="evenodd"
                d="M3.75 5.25a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 6a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75zm0 6a.75.75 0 000 1.5h16.5a.75.75 0 000-1.5H3.75z"
                clipRule="evenodd"
              />
            )}
          </svg>
        </button>
      </div>
    </div>

    {/* Mobile Menu */}
    {mobileOpen && (
      <div className="md:hidden border-t border-gray-100 bg-white">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 grid gap-3 text-sm">
          <Link href="/" className="hover:text-orange-600 transition-colors text-lg text-center py-2" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link href="/#about" className="hover:text-orange-600 transition-colors text-lg text-center py-2" onClick={() => setMobileOpen(false)}>About</Link>
          <Link href="/#services" className="hover:text-orange-600 transition-colors text-lg text-center py-2" onClick={() => setMobileOpen(false)}>Services</Link>
          <Link href="/#contact" className="hover:text-orange-600 transition-colors text-lg text-center py-2" onClick={() => setMobileOpen(false)}>Contact</Link>

          {/* Mobile auth links */}
          {!isAuthenticated ? (
            <>
              <Link href="/login" className="hover:text-orange-600 transition-colors text-lg text-center py-2" onClick={() => setMobileOpen(false)}>Login</Link>
              <Link href="/signup" className="hover:text-orange-600 transition-colors text-lg text-center py-2" onClick={() => setMobileOpen(false)}>Signup</Link>
            </>
          ) : (
            <>
              <Link
                href="/profile"
                className="inline-flex items-center justify-center rounded-full px-7 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all hover:scale-105 text-center"
                onClick={() => setMobileOpen(false)}
              >
                Profile
              </Link>
              <form action="/api/auth/logout" method="post" className="text-center">
                <button
                  className="text-lg text-slate-600 hover:text-red-600 py-2 px-4 rounded-md hover:bg-red-50 transition-colors w-full"
                  type="submit"
                >
                  Logout
                </button>
              </form>
            </>
          )}
        </nav>
      </div>
    )}
  </header>
  )
}

export default Header