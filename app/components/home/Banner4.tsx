"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Banner3() {
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedUserData = localStorage.getItem("user_data");
      const parsedUserData = JSON.parse(storedUserData || "{}");
      setUserData(parsedUserData);
    }
  }, []);

  return (
    <div
      className="relative w-full flex flex-col items-start justify-start min-h-screen overflow-hidden text-left"
     
    >
      {/* Text Section */}
      <div className="flex flex-col items-center justify-center w-full z-10 mt-10 md:mt-16">
        {/* Title */}
        <h1 className="text-[3.5rem] md:text-[7rem] font-extrabold text-black tracking-tight leading-none mb-6 text-center">
          VET365-AI
        </h1>

        {/* Staggered Text Lines */}
        <div className="text-black text-center leading-relaxed font-normal">
          <p className="italic text-base md:text-sm  relative left-[-15px]">
            “Is this normal... or a problem?”{" "}
            <span className="not-italic font-semibold">Vet365 AI gets it.</span>
          </p>
          <p className="text-base md:text-sm relative left-[80px]">
            Real vet heart + AI smarts = instant answers and calm guidance,{" "}
            <span className="font-semibold">24/7.</span>
          </p>
          <p className="text-base md:text-sm relative left-[80px]">
            Coughs, weird snacks, or just a gut feeling — we’ve got you.
          </p>

          <p className="italic text-base md:text-sm relative left-[90px]">
            Because your pet’s health doesn’t take a day off.. <br />
            <span className="not-italic ">and neither do we.</span>{" "}💙
          </p>
        </div>

        {/* Button */}
        <Link
          href="/signup"
          className="bg-black hover:bg-gray-900 text-white px-5 py-2 rounded-full text-sm font-semibold mt-5 transition-all duration-300"
        >
          Let’s Dig In!
        </Link>
      </div>

      {/* Dog Image */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full flex justify-center pointer-events-none select-none">
        <Image
          src="/Dog.avif" // 👈 replace with your actual image
          alt="Dog Banner"
          width={650}
          height={450}
          className="object-contain -mb-4 md:-mb-10"
          priority
        />
      </div>
    </div>

    
  );
}


