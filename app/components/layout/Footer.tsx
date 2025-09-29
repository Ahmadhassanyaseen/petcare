import Link from 'next/link'
import React from 'react'
import { FaFacebook, FaInstagram, FaXTwitter } from "react-icons/fa6";
const Footer = () => {
  return (
    <footer className="mt-10">
    {/* Minimal top area with logo and contact */}
    <div className="bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 grid grid-cols-1 sm:grid-cols-3 items-center gap-6">
        {/* Left: Socials */}
        <div className="flex justify-center sm:justify-start gap-3">
          <Link aria-label="Twitter" href="#" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <FaXTwitter />
          </Link>
          <Link aria-label="Facebook" href="#" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <FaFacebook />
          </Link>
          <Link aria-label="Instagram" href="#" className="p-2 rounded-full bg-white/20 hover:bg-white/30 transition-colors">
            <FaInstagram/>
          </Link>
        </div>

        {/* Center: Logo */}
        <div className="flex justify-center">
          <Link href="#" className="flex items-center gap-2">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-orange-600 font-bold">V</span>
            <span className="text-2xl font-semibold">Vet365</span>
          </Link>
        </div>

        {/* Right: Contact */}
        <div className="text-white/90 text-center sm:text-right">
          <p>Email: support@vet365.com</p>
          <p>Phone: +1 (555) 123-4567</p>
        </div>
      </div>
    </div>
    {/* Copyright strip */}
    <div className="bg-[#111827] text-white/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 text-center">
        © {new Date().getFullYear()} Vet365. All rights reserved.
      </div>
    </div>
  </footer>
  )
}

export default Footer