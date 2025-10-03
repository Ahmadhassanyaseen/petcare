"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function NavbarBanner() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="w-full min-h-screen justify-center items-center flex flex-col bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Navbar */}
      <nav className="min-w-full md:min-w-7xl max-w-7xl flex justify-between items-center py-5 px-6 md:px-20 relative">
        {/* Logo + Text */}
        <div className="flex items-center gap-2">
          <Image
            src="/paw.png"
            alt="VET365 Logo"
            width={40}
            height={40}
            priority
          />
          <h1 className="text-2xl font-bold text-gray-900">VET365.ai</h1>
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex gap-8 text-gray-800 font-medium">
          <li><Link href="#" className="hover:text-orange-500 transition">Home</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition">How It Works</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition">About Us</Link></li>
          <li><Link href="#" className="hover:text-orange-500 transition">Contact</Link></li>
        </ul>

        {/* Desktop Subscribe Button */}
        <div className="hidden md:block">
          <Link
            href="#"
            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition"
          >
            Subscribe Now
            <span className="relative w-5 h-5 flex items-center justify-center">
              <Image src="/Ellipse.png" alt="Circle" width={20} height={20} className="absolute" />
              <Image src="/Arrow.png" alt="Arrow" width={10} height={10} className="relative" />
            </span>
          </Link>
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

        {/* Mobile Menu (Slide-in) */}
        <div
          className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg flex flex-col items-center justify-center gap-6 transform transition-transform duration-300 z-50 ${
            isOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          {/* Close Button */}
          <button
            className="absolute top-5 right-5 text-2xl cursor-pointer"
            onClick={() => setIsOpen(false)}
          >
            ✕
          </button>

          <Link href="#" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>
            Home
          </Link>
          <Link href="#" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>
            How It Works
          </Link>
          <Link href="#" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>
            About Us
          </Link>
          <Link href="#" className="hover:text-orange-500" onClick={() => setIsOpen(false)}>
            Contact
          </Link>

          <Link
            href="#"
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

      {/* Banner Section */}
      <div className="flex max-w-7xl flex-col md:flex-row justify-between items-center flex-1 px-6 md:px-20 py-10 md:py-0">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left space-y-5">
          <h2 className="text-3xl md:text-5xl font-bold leading-snug">
            Talk with our <br />
            <span className="text-gray-900">Veterinarian approved</span> <br />
            <span className="text-orange-500">AI pet health expert </span>
            <span className="text-pink-500">24/7</span>
          </h2>

          <p className="text-gray-700">
            Available 24/7 on your phone or computer, it helps you check if foods,
            chemicals, or plants are dangerous, guides you step by step during
            emergencies, and pinpoints the closest emergency vet when every
            second counts.
          </p>

          {/* Banner Button */}
         <Link
            href="#"
            className="bg-orange-500 w-fit hover:bg-orange-600 text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center gap-2 transition"
          >
            Get Started Now
            <span className="relative w-5 h-5 flex items-center justify-center">
              <Image src="/Ellipse.png" alt="Circle" width={20} height={20} className="absolute" />
              <Image src="/Arrow.png" alt="Arrow" width={10} height={10} className="relative" />
            </span>
          </Link> </div>

        {/* Right Banner Image */}
        <div className="flex justify-center md:justify-end mt-10 md:mt-0">
          <Image
            src="/Bannerimage.png"
            alt="Animals"
            width={671}
            height={447}
            className="rounded-lg"
            priority
          />
        </div>
      </div>
    </div>
  );
}
