"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useSession } from "next-auth/react";

export default function NavbarBanner() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();

  return (
    <div className="w-full  ">
      <header className="bg-[#FFB536] flex justify-between items-center px-4 sm:px-8 lg:px-16 header_nav">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          {/* <span className="text-xl md:text-2xl">🖤</span>
           */}
          <Image
            src="/footer.avif" // replace with your logo
            alt="Vet365 Logo"
            width={30}
            height={30}
            className="rounded-md"
          />
          <span className="font-bold text-base md:text-lg tracking-wide">
            VET365.AI
          </span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 md:space-x-5">
          {session?.user ? (
            <div className="flex gap-3">
              <Link href="/chat">
                <button className="px-3 md:px-5 py-1.5 md:py-2 text-sm md:text-base font-medium">
                  Let's Chat
                </button>
              </Link>

              <Link href="/profile">
                <button className="bg-black text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium transition hover:bg-[#FFB536] hover:text-black hover:shadow-2xl">
                  Profile
                </button>
              </Link>
            </div>
          ) : (
            <Link href="/login">
              <button className="bg-black text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-medium hover:bg-gray-800 transition">
                Fetch Your Account
              </button>
            </Link>
          )}
        </div>
      </header>
    </div>
  );
}
