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
      className="w-full pt-8 pb-12 justify-center items-center flex flex-col bg-no-repeat bg-center"
      style={{
        backgroundImage: "url('/bg.png')",
        backgroundSize: "cover",
      }}
    >
      {/* Navbar */}
      <NavbarBanner/>

      {/* Banner Section */}
      <div className="flex mt-3 max-w-7xl flex-col lg:flex-row justify-between items-center flex-1 px-6 md:px-20 xl:px-0 py-0 md:py-0" id="home">
        {/* Left Content */}
        <div className="max-w-xl text-center md:text-left space-y-5">
          <h2 className="text-3xl md:text-4xl font-bold leading-snug">
           Get A Veterinarian Medical Expert 
            <span className="bg-gradient-to-r from-orange-400 via-pink-500 to-purple-600 bg-clip-text text-transparent"> in Your Pocket 
            24/7</span>
          </h2>

          <p className="text-gray-700 text-xl">
            {/* Available 24/7 on your phone or computer, it helps you check if foods,
            chemicals, or plants are dangerous, guides you step by step during
            emergencies, and pinpoints the closest emergency vet when every
            second counts. */}
            Conversational guidance on health, nutrition & emergencies — anywhere, anytime.
            24/7 AI Veterinary Expertise — Just start a conversation and get the answers.
            Subscribe and get round-the-clock access to an AI-powered veterinary medical expert — 
            available 24/7/365. Connected to trusted sources like ChatGPT and vast veterinary health databases, 
            this advanced conversational AI Vet expert delivers reliable guidance on your pet’s health, nutrition, 
            and emergencies anytime you need it. Simply create an account, tap “Speak with the AI Vet,” ask your question out loud,
            and have a natural, hands-free conversation — no typing required.
          </p>

          {/* Banner Button */}
         <Link
            href="/signup"
            className="bg-purple-500 mx-auto md:mx-0 w-fit hover:bg-purple-600 text-white px-4 py-2 rounded-full text-xl font-semibold flex items-center gap-2 transition"
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
