// app/components/Footer.tsx
"use client";
import Link from "next/link";
import Image from "next/image";
import { FaFacebookF, FaXTwitter, FaLinkedinIn, FaYoutube, FaInstagram } from "react-icons/fa6";

export default function Footer() {
  return (
    <footer className="w-full bg-[#f6f6fc]  pt-12 pb-6 px-6 md:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Logo + Info */}
        <div className="items-center flex flex-col">
          <div className="flex items-center gap-2 text-2xl font-bold text-gray-900">
            <Image
              src="/paw.png" // replace with your logo
              alt="Vet365 Logo"
              width={40}
              height={40}
              className="rounded-md"
            />
            VET365.ai
          </div>
          <p className="mt-4 text-gray-600 text-sm leading-relaxed">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
          </p>
          <button className="mt-6 bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-4xl text-sm font-semibold flex items-center gap-3 transition">
  Request a Demo
  <span className="relative w-6 h-6 flex items-center justify-center">
    {/* White Circle Image */}
    <Image
      src="/Ellipse.png" // replace with your circle image
      alt="Circle"
      width={24}
      height={24}
      className="absolute"
    />
    {/* Yellow Arrow Image */}
    <Image
      src="/Arrow.png" // replace with your arrow image
      alt="Arrow"
      width={12}
      height={12}
      className="relative"
    />
  </span>
</button>


        </div>

        {/* General Links */}
        <div className=" items-center flex flex-col">
          <h4 className="font-semibold text-gray-900 mb-4">General Links</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link href="/">Home</Link></li>
            <li><Link href="/how-it-works">How it works</Link></li>
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* Legal */}
        <div className=" items-center flex flex-col">
          <h4 className="font-semibold text-gray-900 mb-4">Legal</h4>
          <ul className="space-y-2 text-sm text-gray-700">
            <li><Link href="/privacy-policy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Socials */}
        <div className=" items-center flex flex-col">
          <h4 className="font-semibold text-gray-900 mb-4">Follow us</h4>
          <div className="flex gap-4 text-orange-500 text-xl">
            <Link href="https://facebook.com" target="_blank"><FaFacebookF /></Link>
            <Link href="https://twitter.com" target="_blank"><FaXTwitter /></Link>
            <Link href="https://linkedin.com" target="_blank"><FaLinkedinIn /></Link>
            <Link href="https://youtube.com" target="_blank"><FaYoutube /></Link>
            <Link href="https://instagram.com" target="_blank"><FaInstagram /></Link>
          </div>
        </div>
      </div>

      {/* Bottom Line */}
      <div className="max-w-7xl mx-auto mt-12 border-t border-gray-200 pt-4 text-center text-gray-600 text-sm">
        Vet365.ai © 2025. All rights reserved.
      </div>
    </footer>
  );
}
