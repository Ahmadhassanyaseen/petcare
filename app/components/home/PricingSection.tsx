"use client";
import React from "react";

export default function PricingSection() {
  return (
    <section className="min-h-screen bg-[#c5a4ff] flex flex-col justify-center px-6 md:px-16 py-16">
      {/* Heading */}
      <div className="mb-12 text-left">
        <h1 className="text-[42px] md:text-[64px] font-extrabold leading-tight text-black">
          Choose the Right Plan <br className="hidden md:block" />
          for You &amp; Your Pet
        </h1>
      </div>

      {/* Pricing Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-6xl w-full">
        {/* Left Card */}
        <div className="bg-[#ffb930] rounded-3xl p-8 md:p-12 text-black shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-extrabold mb-2 ">
              Just Sniffing It Out?
            </h2>
            <div className="border-b border-black w-70 mb-6"></div>

            <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
              Dip your paws in! <br />
              <strong>No commitment,</strong> just minutes on demand — perfect for
              checking out Vet365 AI and seeing the magic. <br />
              🐾 <strong>Just Sniffing It Out</strong> – 10-minute intro, $5.99
            </p>

            <p className="text-[16px] md:text-[18px] leading-relaxed mb-4">
              A little sniff before you commit! Perfect for first-timers who want
              to meet Kora, ask a quick question, and see how the magic works.
              Your Welcome Wag is waiting — tail wags guaranteed, no strings
              attached.
            </p>
            <div className="border-b border-black w-70 mb-6"></div>


            <ul className="space-y-2 text-[16px] md:text-[18px] leading-relaxed mt-4">
              <li>🦴 <strong>10 minutes of real-time guidance</strong></li>
              <li>for curious cats & doggone curious parents</li>
              <li>🚫 <strong>No subscription needed</strong></li>
              <li>💬 Pay-as-you-go pet advice</li>
              <li>
                🐾 <strong>Real vet-trained answers, 24/7</strong> <br />
                (no waiting rooms or cat-naps required)
              </li>
              <li>
                🎉 First-time intro offer included — you’ll be feline fine in no
                time
              </li>
              <li>
                🩺 A taste of how fast and friendly AI vet support can feel
              </li>
              <li>
                🦴 <em>Try it once, fall in ruff.</em> <br /> One time, new
                account only
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <p className="text-[20px] md:text-[22px] font-bold mb-4">
              $5.99 intro offer
            </p>
            <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-[16px] hover:bg-gray-900 transition">
              Sniff It Out
            </button>
          </div>
        </div>

        {/* Right Card */}
        <div className="bg-[#47e5d2] rounded-3xl p-8 md:p-12 text-black shadow-lg flex flex-col justify-between">
          <div>
            <h2 className="text-[24px] md:text-[28px] font-extrabold mb-1">
              Pawblem Solver
            </h2>
            <p className="text-[18px] md:text-[20px] font-bold mb-2">
              Monthly Plan
            </p>
            <div className="border-b border-black w-24 mb-6"></div>

            <p className="text-[16px] md:text-[18px] leading-relaxed mb-4 italic">
              Go all in! 20 minutes included every month, <br />
              rollover + add-ons, unlimited peace of mind.
            </p>
            <div className="border-b border-black w-70 mb-6"></div>



            <ul className="space-y-2 text-[16px] md:text-[18px] leading-relaxed">
              <li>
                ⏱  <strong>20 vet-trained minutes each month</strong>
                <br />
                fetch or purr-use as you please
              </li>
              <li> 
                🔁<strong>Rollover unused minutes!</strong> <br />
                (no bones or hairballs about it)
              </li>
              <li>
                ➕  <strong>Add extra minutes anytime</strong> <br />
                with exclusive member discounts
              </li>
              <li>
                💬 <strong>Real-time answers, day or night</strong> <br />
                — no waiting, no whining
              </li>
              <li>
                🩺 <strong>Step-by-step guidance</strong> <br />
                from trusted, vet-approved sources
              </li>
              <li>
                🎁 <strong>Member perks that keep on giving</strong> <br />
                — from extra minutes to early treats
              </li>
              <li>
                🐾 <strong>Monthly plan = worry-free peace of mind</strong> <br />
                for every good boy and clever cat
              </li>
            </ul>
          </div>

          <div className="mt-8">
            <button className="bg-black text-white px-6 py-3 rounded-full font-semibold text-[16px] hover:bg-gray-900 transition mb-4">
              Join the Pack
            </button>
            <p className="text-[20px] md:text-[22px] font-bold">$14.99/month</p>
          </div>
        </div>
      </div>
    </section>
  );
}
