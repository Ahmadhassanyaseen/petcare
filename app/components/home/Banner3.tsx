"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import NavbarBanner from "./Navbar";

export default function Banner3() {
  const [isOpen, setIsOpen] = useState(false);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    // Check if we're on the client side before accessing localStorage
    if (typeof window !== 'undefined') {
      const storedUserData = localStorage.getItem("user_data");
      const parsedUserData = JSON.parse(storedUserData || "{}");
      setUserData(parsedUserData);
      console.log(parsedUserData);
    }
  }, []);

  return (
    <div
      className="w-full min-h-screen justify-center items-center flex flex-col bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Navbar */}
      <NavbarBanner/>

      {/* Banner Section */}
      <div className="flex max-w-7xl flex-col md:flex-row justify-between items-center flex-1 px-6 md:px-20 py-10 md:py-0" id="home">
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
