// app/components/PricingPlans.tsx
"use client";
import Image from "next/image";

export default function PricingPlans() {
  return (
    <section className="w-full bg-white py-16 px-6">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose the Right Plan for{" "}
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 bg-clip-text text-transparent">
            You & Your Pet
          </span>
        </h2>

        {/* Pricing Cards */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Standard Plan */}
          <div className="w-full border rounded-2xl shadow-sm p-8 flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-800">Standard</h3>
            <p className="text-gray-500 mt-1">
              Everything you need to get started.
            </p>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              $25 <span className="text-base font-medium text-gray-500">/mo</span>
            </p>

            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                General checkups
              </li>
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                Vaccination reminders
              </li>
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                Basic grooming
              </li>
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                Email support
              </li>
            </ul>

            <button className="mt-8 w-full bg-orange-500 text-white py-3 rounded-4xl font-semibold hover:bg-orange-600 transition">
              Choose Monthly
            </button>
          </div>

          {/* Pro Plan */}
          <div className="w-full border rounded-2xl shadow-md p-8 flex flex-col items-start relative">
            <span className="absolute top-4 right-4 bg-orange-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>

            <h3 className="text-lg font-semibold text-gray-800">Pro</h3>
            <p className="text-gray-500 mt-1">
              Best for ongoing care and pampering.
            </p>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              $49 <span className="text-base font-medium text-gray-500">/mo</span>
            </p>

            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                All Standard features
              </li>
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                Priority appointments
              </li>
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                Advanced grooming
              </li>
              <li className="flex items-center gap-3">
                <Image src="/group56.png" width={20} height={20} alt="icon" />
                24/7 chat support
              </li>
            </ul>

            <button className="mt-8 w-full bg-orange-500 text-white py-3 rounded-4xl font-semibold hover:bg-orange-600 transition">
              Choose Monthly
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
