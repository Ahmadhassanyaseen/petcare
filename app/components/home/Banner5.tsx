"use client";
import Image from "next/image";
import { motion } from "framer-motion";

export default function Banner5() {
  return (
    <section className="w-full font-[Poppins]">
      {/* 🟨 Header Section */}
      <header className="bg-[#FFB536] flex justify-between items-center px-4 sm:px-8 lg:px-16 py-3 md:py-4">
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <span className="text-xl md:text-2xl">🖤</span>
          <span className="font-bold text-base md:text-lg tracking-wide">VET365-AI</span>
        </div>

        {/* Right Actions */}
        <div className="flex items-center space-x-3 md:space-x-5">
          <button className="text-sm md:text-base font-medium flex items-center space-x-1 hover:opacity-80 transition">
            <span>👤</span>
            <span>Chat</span>
          </button>
          <button className="bg-black text-white px-3 md:px-5 py-1.5 md:py-2 rounded-full text-sm md:text-base font-semibold hover:bg-gray-800 transition">
            Fetch Your Account
          </button>
        </div>
      </header>

      {/* 🟪 Main Banner */}
      <main
        className="bg-[#B57DFF] flex flex-col items-center text-center px-4 sm:px-6 md:px-10 relative overflow-hidden"
        style={{ minHeight: "630px" }}
      >
        <h1 className="text-[70px] md:text-[90px]  lg:text-[110px] font-extrabold leading-none tracking-tight text-black" style={{ lineHeight: '0.9em',marginTop: '20px',letterSpacing: '0.7rem' }}>
          VET365-AI
        </h1>
        <div className="ml-[200px]  md:ml-[60px] text-start">
          <p className="italic text-sm sm:text-base md:text-lg text-black/90 ml-[20px] md:ml-[60px]">
            “Is this normal... or a problem?” <span className="not-italic font-semibold">Vet365 AI gets it.</span>
          </p>
          <p className="text-sm sm:text-base md:text-lg text-black/90 ml-[30px] md:ml-[150px]">
            Coughs, weird snacks, or just a gut feeling — we’ve got you.
          </p>
          <p className="text-sm sm:text-base md:text-lg text-black/90 ml-[60px] md:ml-[240px]">
            Real vet heart + AI smarts = instant answers and calm guidance, 24/7.
          </p>
          <p className="italic text-sm sm:text-base md:text-lg text-black/90 ml-[80px] md:ml-[330px]">
            Because your pet’s health doesn’t take a day off... <br />
            <span className="not-italic ml-[100px] md:ml-[300px] block">and neither do we. 💙</span>
          </p>
        </div>
        <button className="mt-2 bg-black text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full text-sm sm:text-base md:text-lg font-semibold hover:bg-gray-800 transition">
          Let’s Dig In!
        </button>

        {/* 🐶 Dog Image Section */}
        <div
          className="mt-0  w-[80%] sm:w-[70%] md:w-[60%] lg:w-[45%] flex justify-center"
          style={{ minHeight: "260px" }}
        >
          <Image
            src="/Dog.avif"
            alt="Dog"
            width={720}
            height={518}
            priority
            className="object-contain"
            style={{
              position: "absolute",
              top: "18%",
              color: "transparent",
            }}
          />
        </div>
      </main>


      {/* 🟦 Scrolling Text Section */}
      <div className="bg-[rgb(31,237,222)] py-3 sm:py-4 overflow-hidden border-t border-black/10">
        <motion.div
          className="whitespace-nowrap font-extrabold text-[1.4rem] sm:text-[1.7rem] md:text-[2rem] flex items-center gap-8"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            duration: 20,
            ease: "linear",
          }}
        >
          {Array(2)
            .fill(
              "🐾 ✋ Always on call. Always pawsitive. 🐾 ✋ Always on call. Always pawsitive."
            )
            .map((text, i) => (
              <span key={i} className="mx-6 tracking-tight">
                {text}
              </span>
            ))}
        </motion.div>
      </div>
    </section>
  );
}
