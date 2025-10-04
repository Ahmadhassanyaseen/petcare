"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavbarBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const [parsedUserData, setParsedUserData] = useState<any>(null);

  useEffect(() => {
    // Only runs on client
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setParsedUserData(JSON.parse(userData));
      } catch (err) {
        console.error("Failed to parse user data", err);
      }
    }
  }, []);

  return (
    <div
      className="w-full  justify-center items-center flex flex-col bg-no-repeat bg-center"
     
    >
      {/* Navbar */}
      <nav className="min-w-full md:min-w-7xl max-w-7xl flex justify-between items-center py-5 px-6 md:px-20 relative">
        {/* Logo + Text */}
        <div className="flex items-center gap-2">
          <Image src="/paw.png" alt="VET365 Logo" width={40} height={40} priority />
          <h1 className="text-2xl font-bold text-gray-900">VET365.ai</h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-gray-800 font-medium">
          <li><Link href="#home" className="hover:text-orange-500 transition">Home</Link></li>
          <li><Link href="#work" className="hover:text-orange-500 transition">How It Works</Link></li>
          <li><Link href="#about" className="hover:text-orange-500 transition">About Us</Link></li>
          {parsedUserData ? (
            <li><Link href="/profile" className="hover:text-orange-500 transition">Profile</Link></li>
          ) : (
            <>
              <li><Link href="/login" className="hover:text-orange-500 transition">Login</Link></li>
              <li><Link href="/signup" className="hover:text-orange-500 transition">Create Account</Link></li>
            </>
          )}
        </ul>

        {/* Desktop Subscribe/Chat Button */}
        <div className="hidden md:block">
          {parsedUserData ? (
            <Link
              href="/chat"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition"
            >
              Chat Now
              <span className="relative w-5 h-5 flex items-center justify-center">
                <Image src="/Ellipse.png" alt="Circle" width={20} height={20} className="absolute" />
                <Image src="/Arrow.png" alt="Arrow" width={10} height={10} className="relative" />
              </span>
            </Link>
          ) : (
            <Link
              href="#plans"
              className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition"
            >
              Subscribe Now
              <span className="relative w-5 h-5 flex items-center justify-center">
                <Image src="/Ellipse.png" alt="Circle" width={20} height={20} className="absolute" />
                <Image src="/Arrow.png" alt="Arrow" width={10} height={10} className="relative" />
              </span>
            </Link>
          )}
        </div>

        {/* Mobile Hamburger */}
        <button
          className="md:hidden flex flex-col gap-1 cursor-pointer"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
          <span className="w-6 h-0.5 bg-gray-800"></span>
        </button>

        {/* Mobile Menu */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg flex flex-col items-center justify-center gap-6 transform transition-transform duration-300 z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <button
            className="absolute top-5 right-5 text-2xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>
          <Link href="#home" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>Home</Link>
          <Link href="#work" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>How It Works</Link>
          <Link href="#about" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>About Us</Link>
          <Link
            href="#plans"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition"
            onClick={() => setIsOpen(false)}
          >
            Subscribe Now
            <span className="relative w-5 h-5 flex items-center justify-center">
              <Image src="/Ellipse.png" alt="Circle" width={20} height={20} className="absolute" />
              <Image src="/Arrow.png" alt="Arrow" width={10} height={10} className="relative" />
            </span>
          </Link>
        </div>
      </nav>
    </div>
  );
}
