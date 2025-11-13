"use client";

import React, { useState } from 'react';
import Reveal from '../common/Reveal';
import PriceCard from '../cards/PriceCard';

const Pricing: React.FC = () => {
  // const [billing, setBilling] = useState<'monthly' | 'yearly'>('monthly');

  // const isYearly = billing === 'yearly';

  return (
    <section id="pricing" className="relative py-16 sm:py-20 lg:py-24 bg-white max-w-6xl mx-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Reveal className="text-center mb-12" direction="up">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose the Right Plan for{" "}
          <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-pink-600 bg-clip-text text-transparent">
            You & Your Pet
          </span>
        </h2>
          {/* <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900">Our Pricing</h2>
          <p className="mt-3 text-slate-600 max-w-2xl mx-auto">
            Choose the plan that fits your pet's needs. You can always upgrade later.
          </p> */}
          {/* Billing toggle */}
          {/* <div className="mt-6 inline-flex items-center rounded-full border border-gray-200 p-1 bg-white shadow-sm">
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${!isYearly ? 'bg-gradient-to-r from-[#B57DFF] to-[#ff8a1e] text-white' : 'text-slate-700 hover:bg-gray-100'}`}
              onClick={() => setBilling('monthly')}
            >
              Monthly
            </button>
            <button
              className={`px-4 py-2 text-sm rounded-full transition-colors ${isYearly ? 'bg-gradient-to-r from-[#B57DFF] to-[#ff8a1e] text-white' : 'text-slate-700 hover:bg-gray-100'}`}
              onClick={() => setBilling('yearly')}
            >
              Yearly
            </button> */}
          {/* </div> */}
          </Reveal>
          {/* <div className="mt-2 text-xs text-slate-500">{isYearly ? 'Save 20% with yearly billing' : 'Billed monthly'}</div> */}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-10">
          {/* Standard */}
          <Reveal direction="up">
          <PriceCard
            tier="Standard"
            description="Everything you need to get started."
            price={25}
            period={ '/mo'}
            features={[
              'General checkups',
              'Vaccination reminders',
              'Basic grooming',
              'Email support',
            ]}
            buttonText={'Choose Monthly'}
          />
          </Reveal>

          {/* Pro (highlight) */}
          <Reveal delay={120} direction="up">
          <PriceCard
            tier="Pro"
            description="Best for ongoing care and pampering."
            price={49}
            period={'/mo'}
            features={[
              'All Standard features',
              'Priority appointments',
              'Advanced grooming',
              '24/7 chat support',
            ]}
            highlight
            badge="Most Popular"
            buttonText={'Choose Monthly'}
          />
          </Reveal>
      </div>
    </section>
  );
};

export default Pricing;
