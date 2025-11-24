"use client";

import React from "react";

export default function PricingSection2() {
  return (
    <section className="bg-[#B57DFF]">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-6xl w-full mx-auto">
        <div className="border-2 bg-[#e97132] border-orange-300 rounded-[62px] p-3 md:p-6 shadow-md flex flex-col relative overflow-hidden">
          <div className="bg-white p-4 m-0 relative">
            <div className="w-full flex justify-between mt-6 align-center px-4">
              <div className="text-center">
                <img
                  src="/trialplan.png"
                  alt="Trial Offer"
                  className="w-24 h-24 object-contain"
                />
                <p className="text-lg font-medium mt-1">Around</p>
              </div>
              <h2 className="text-2xl font-bold italic">Just Sniffing</h2>
            </div>

            <div className="text-center mb-4 mt-2">
              <p className="text-xl font-semibold mt-1">$5.99</p>
            </div>

            <h3 className="text-lg font-semibold mb-2 italic">Trial Offer</h3>

            <p className="text-gray-700 leading-relaxed mb-6 text-sm">
              A little sniff before you commit! Perfect for first timers who
              want to meet Kora the AI Vet, ask a quick question, and see how
              the magic works. Your Welcome Wag is waiting — tail wags
              guaranteed, no strings attached.
            </p>

            <ul className="space-y-4 text-gray-700 text-sm">
              <li>
                🩺 <strong>10 minutes of talk-time guidance</strong>
                <br />
                for curious cats & doggone pet parents
              </li>
              <li>
                🚫 <strong>No Monthly subscription needed</strong>
                <br />
                Ask the conversational AI with no commitment
              </li>
              <li>
                💬 <strong>Pay-as-you-go pet advice</strong>
                <br />
                Add talk time minutes as you need them
              </li>
              <li>
                🐾 <strong>Real vet-trained answers, 24/7</strong>
                <br />
                Get expert advice when you need it!
              </li>
            </ul>

            <p className="mt-6 text-gray-700 text-sm">
              A taste of how fast and friendly AI vet support can feel,{" "}
              <strong>TRY IT NOW</strong>
            </p>

            <button
              className="mt-6 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-xl w-full"
              
            >
              Activate your Account Now!
            </button>
          </div>
        </div>

        <div className=" border-2 bg-[#caeefb] border-blue-300 rounded-[62px] p-3 md:p-6 shadow-md flex flex-col relative overflow-hidden">
          <div className="bg-white p-4 m-0 relative">
            <div className="w-full flex justify-between align-center px-4 mt-6">
              <div className="text-center">
                <img
                  src="/pawblem_solver.png"
                  alt="Pawblem Solver"
                  className="w-24 h-24 object-contain"
                />
                <p className="text-lg font-medium mt-1">Solver</p>
              </div>
              <h2 className="text-2xl font-bold italic">Pawblem</h2>
            </div>
            <div className="text-center mb-4 mt-2"></div>
            <h3 className="text-lg font-semibold mb-2">Monthly Plan</h3>
            <p className="text-gray-700 leading-relaxed mb-6 text-sm">
              Protect your pet, by getting 24/7 access the most advanced expert
              pet health advice right from your phone or computer. Get emergency
              advice, nutrition and other questions answered when you need it.
              This plan gives you 22 minutes of talk time with the
              conversational AI veterinarian.
            </p>
            <ul className="space-y-4 text-gray-700 text-sm">
              <li>
                🩺 <strong>22 minutes of talk-time guidance</strong>
                <br />
                for curious cats & doggone pet parents
              </li>
              <li>
                🔄 <strong>Roll-Over Minutes</strong>
                <br />
                Unused minutes roll over each month to give you the best value.
              </li>
              <li>
                💬 <strong>Pet protected 365 days a year</strong>
                <br />
                This monthly plan gives you expert advice every day
              </li>
              <li>
                🐾 <strong>Real vet-trained answers, 24/7</strong>
                <br />
                Get expert advice when you need it!
              </li>
            </ul>{" "}
            <br /> <br />
            <button
              className="mt-6 bg-[#caeefb] hover:bg-[#85dfff] text-black font-semibold py-3 px-6 rounded-xl w-full"
             
            >
              Activate your Account Now!
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
