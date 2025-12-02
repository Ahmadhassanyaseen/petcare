"use client";
import Image from "next/image";
import { motion } from "framer-motion";
import { syne } from "../../fonts";
export default function Banner5() {
  return (
    <section className="w-full font-[Poppins]">
      {/* 🟪 Main Banner */}
      <main className="main_banner bg-[#B57DFF] flex flex-col items-center text-center px-4 sm:px-6 md:px-10 relative overflow-hidden">
        <h1
          className={`${syne.variable} font-syne banner_heading font-extrabold leading-none tracking-tight text-black mt-2 md:mt-4 `}
          style={{
            lineHeight: "0.9em",
            letterSpacing: "0.7rem",
          }}
        >
          VET365.AI
        </h1>
        <div className="ml-[0x]  md:ml-[120px]  lg:ml-[260px] text-start text-[9.5px] sm:text-base md:text-[16px] lg:text-lg text-black/90 font-medium">
          <p className="italic ml-[60px] md:ml-[40px] lg:ml-[60px] mt-3 md:mt-6">
            “Is this normal... or a problem?”{" "}
            <span className="not-italic font-semibold">Vet365 AI gets it.</span>
          </p>
          <p className="ml-[30px] md:ml-[80px] lg:ml-[150px]">
            Coughs, weird snacks, or just a gut feeling — we’ve got you.
          </p>
          <p className="ml-[20px] md:ml-[120px] lg:ml-[240px]">
            Real vet heart + AI smarts = instant answers and calm guidance,
            24/7.
          </p>
          <p className="italic ml-[80px] md:ml-[170px] lg:ml-[330px]">
            Because your pet’s health doesn’t take a day off... <br />
            <span className="not-italic ml-[100px] md:ml-[190px] lg:ml-[300px] block">
              and neither do we. 💙
            </span>
          </p>
        </div>
        <button className="mt-1 bg-black text-white px-6 md:px-8 py-3 md:py-3.5 rounded-full text-sm sm:text-base md:text-lg  transition hover:bg-[#FFB536] hover:text-black">
          Let’s Dig In!
        </button>

        {/* 🐶 Dog Image Section */}
        <div className="image_container mt-0 w-[80%] sm:w-[70%] md:w-[60%] lg:w-[60%] flex justify-center">
          <Image
            src="/Dog.avif"
            alt="Dog"
            width={720}
            height={518}
            priority
            className="w-full banner_image  h-full md:h-auto object-contain"
            style={{
              position: "absolute",
              bottom: "0",
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
              "🐾 Always on call. Always pawsitive. 🐾 Always on call. Always pawsitive."
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
