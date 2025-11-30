// app/components/PricingPlans.tsx
"use client";
import Image from "next/image";
import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import PaymentModal from "./PaymentModal";
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CardForm = ({ 
  minutes, 
  userId, 
  onClose, 
  clientSecret 
}: { 
  minutes: string; 
  userId: string; 
  onClose: () => void; 
  clientSecret: string;
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements || !cardholderName.trim() || !clientSecret) {
      setError("Please fill in all fields");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const cardElement = elements.getElement(CardElement);

      if (!cardElement) {
        setError("Card element not found");
        return;
      }

      // Confirm the payment intent with card element
      const { error: confirmError, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: {
            name: cardholderName,
          },
        },
      });

      if (confirmError) {
        setError(confirmError.message || "Payment confirmation failed");
        return;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        // Process the successful payment
        const response = await fetch("/api/purchase-minutes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            userId,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Payment processing failed");
          return;
        }

        if (data.success) {
          alert(`Payment successful! ${data.minutesAdded} minutes have been added to your account.`);
          onClose();
          router.refresh(); // Refresh to show updated minutes
        } else {
          setError("Payment processing failed");
        }
      }

    } catch (err: any) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // const packageInfo = MINUTES_PACKAGES[minutes as keyof typeof MINUTES_PACKAGES];

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={cardholderName}
          onChange={(e) => setCardholderName(e.target.value)}
          className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
          placeholder="John Doe"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Information
        </label>
        <div className="p-3 border border-gray-300 rounded-lg focus-within:ring-2 focus-within:ring-orange-500 focus-within:border-transparent">
          <CardElement
            options={{
              style: {
                base: {
                  fontSize: "16px",
                  color: "#424770",
                  "::placeholder": {
                    color: "#aab7c4",
                  },
                },
              },
            }}
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <div className="flex gap-4 justify-center pt-4">
        <button
          type="button"
          onClick={onClose}
          className="px-6 py-3 rounded-lg bg-gray-300 hover:bg-gray-400 text-gray-800 font-medium transition-colors"
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#B57DFF] to-[#ff8a1e] text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !stripe}
        >
          {loading ? "Processing..." : `Pay ${minutes}`}
        </button>
      </div>
    </form>
  );
};

interface PricingPlansProps {
  onPaymentSuccess?: () => void;
}

export default function PricingPlans({ onPaymentSuccess }: PricingPlansProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | "professional" | null>(null);

  // Get userId from localStorage like in Pricing2.tsx
  const userData = typeof window !== 'undefined' ? localStorage.getItem("user_data") : null;
  const userId = userData ? JSON.parse(userData).id : "";

  const openModal = (plan: "basic" | "premium" | "professional") => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  return (
    <section className="w-full bg-[#B57DFF] py-16 px-6" id="plans">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-bold text-gray-900">
          Choose the Right Plan for{" "}
          <span className="">
            You & Your Pet
          </span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-6xl w-full mx-auto mt-6">
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
            <button  onClick={() => openModal("basic")} className="bg-black text-white px-6 py-3 rounded-full font-semibold text-[16px] hover:bg-gray-900 transition">
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
              <button  onClick={() => openModal("premium")} className="bg-black text-white px-6 py-3 rounded-full font-semibold text-[16px] hover:bg-gray-900 transition mb-4">
                Join the Pack
              </button>
              <p className="text-[20px] md:text-[22px] font-bold">$14.99/month</p>
            </div>
          </div>
        </div>

        {/* Pricing Cards */}
        {/* <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
        
          <div className="w-full border rounded-2xl shadow-sm p-8 flex flex-col items-start">
            <h3 className="text-lg font-semibold text-gray-800">Standard</h3>
            <p className="text-gray-500 mt-1">
              Everything you need to get started.
            </p>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              $9.99 <span className="text-base font-medium text-gray-500">/mo</span>
              <span className="text-base text-[12px] lg:text-[14px] md:text-[9px] text-gray-500 ms-5">$0.33 center per min</span>
            </p>

            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>

                <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]">30 Minutes Talk Time <span className="font-normal">(buy additional minutes)</span></span>
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                 
                <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]">Medical Emergencies  <span className="font-normal">(expert advice)</span></span>
            
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                 
                 <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]"> Medications Information  <span className="font-normal">(get the details)</span></span>
            
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                
                 <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]"> Get Expert Advice  <span className="font-normal">(for any medical situations)</span></span>
            
              </li>
               <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
               
                 <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]"> Research any disease / Diagnosis  </span>
            
              </li>
            </ul>

            <button
              onClick={() => openModal("basic")}
              className="mt-8 w-full bg-purple-500 text-white py-3 rounded-4xl font-semibold hover:bg-purple-600 transition"
            >
              Subscribe Now
            </button>
          </div>

         
          <div className="w-full border rounded-2xl shadow-md p-8 flex flex-col items-start relative">
            <span className="absolute top-4 right-4 bg-purple-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Most Popular
            </span>

            <h3 className="text-lg font-semibold text-gray-800">Pro</h3>
            <p className="text-gray-500 mt-1">
              Best for ongoing care and pampering.
            </p>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              $19.99 <span className="text-base font-medium text-gray-500">/mo</span>
              <span className="text-base text-[12px] lg:text-[14px] md:text-[9px] text-gray-500 ms-5">$0.22 center per min</span>
            </p>

            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center gap-2">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>

                <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]">90 Minutes Talk Time <span className="font-normal">(buy additional minutes)</span></span>
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                 
                <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]">Medical Emergencies  <span className="font-normal">(expert advice)</span></span>
            
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                 
                 <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]"> Medications Information  <span className="font-normal">(get the details)</span></span>
            
              </li>
              <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                
                 <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]"> Get Expert Advice  <span className="font-normal" >(for any medical situations)</span></span>
            
              </li>
               <li className="flex items-center gap-2">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
               
                 <span className="font-bold text-[12px] lg:text-[14px] md:text-[11px]"> Research any disease / Diagnosis  </span>
            
              </li>
            </ul>

            <button
              onClick={() => openModal("premium")}
              className="mt-8 w-full bg-purple-500 text-white py-3 rounded-4xl font-semibold hover:bg-purple-600 transition"
            >
              Subscribe Now
            </button>
          </div> */}

          {/* Professional Plan */}
          {/* <div className="w-full border rounded-2xl shadow-lg p-8 flex flex-col items-start relative">
            <span className="absolute top-4 right-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white text-xs font-semibold px-3 py-1 rounded-full">
              Best Value
            </span>

            <h3 className="text-lg font-semibold text-gray-800">Professional</h3>
            <p className="text-gray-500 mt-1">
              Complete veterinarian support and expertise.
            </p>

            <p className="mt-4 text-4xl font-bold text-gray-900">
              $49.99 <span className="text-base font-medium text-gray-500">/mo</span>
            </p>

            <ul className="mt-6 space-y-4 text-gray-700">
              <li className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                All Premium features
              </li>
              <li className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                Advanced medical advice
              </li>
              <li className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                Surgery preparation guidance
              </li>
              <li className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                Specialist referrals
              </li>
              <li className="flex items-center gap-3">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle cx="10" cy="10" r="9.25" stroke="url(#paint0_linear_8_128)" strokeWidth="1.5"/>
                  <path d="M15 6.60003L7.8 13.8L4.5 10.5L5.346 9.65403L7.8 12.102L14.154 5.75403L15 6.60003Z" fill="#FF921F"/>
                  <defs>
                  <linearGradient id="paint0_linear_8_128" x1="20" y1="-2.38419e-07" x2="3.2" y2="12.8" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#FF921F"/>
                  </linearGradient>
                  </defs>
                  </svg>
                Priority veterinarian access
              </li>
            </ul>

            <button
              onClick={() => openModal("professional")}
              className="mt-8 w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-4xl font-semibold hover:from-orange-600 hover:to-pink-600 transition"
            >
              Choose Professional
            </button>
          </div> */}
        </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        userId={userId}
        onPaymentSuccess={onPaymentSuccess}
      />
      {/* </div> */}
    </section>
  );
}
