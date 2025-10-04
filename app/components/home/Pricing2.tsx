import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import PaymentModal from "./PaymentModal";
export default function Pricing2() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<"basic" | "premium" | "professional" | null>(null);

  const openModal = (plan: "basic" | "premium" | "professional") => {
    setSelectedPlan(plan);
    setIsOpen(true);
  };
  const userData = localStorage.getItem("user_data");
  const userId = userData ? JSON.parse(userData).id : null;
  
  return (
    <div className="bg-[#FBAA30] min-h-screen py-[50px] px-5 font-sans">
      <div className="grid md:grid-cols-3 gap-6 max-w-6xl mx-auto">
        {/* Basic Plan */}
        <div className="bg-[#FDC374] rounded-2xl shadow-lg px-8 py-10  text-center">
          <h2 className="text-4xl font-bold text-center mb-3">Basic Plan</h2>
          <p className="text-sm mb-4">
            Pet owners, you can speak to the AI expert to ask unlimited numbers
            of questions and get all of your important details for your
            questions answered 24 hours a day and seven days a week
          </p>
          <ul className="list-disc list-inside text-sm text-left space-y-1 mb-4">
            <li>24/7 access</li>
            <li>Emergency Advice</li>
            <li>Conversational AI</li>
            <li>Food, allergy advice</li>
            <li>Exercise advice</li>
            <li>Bathing & skin care advice</li>
            <li>Poison control assistance</li>
            <li>Dog training tips</li>
            <li>Includes 1,000 minutes of talk</li>
          </ul>
          <p className="text-4xl font-bold text-center mb-4">$9.99 month</p>
          <button  className="inline-flex text-xl mt-4 items-center justify-center rounded-full px-7 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all hover:scale-105 text-center cursor-pointer" onClick={() => openModal("basic")}>
            JOIN NOW
          </button>
        </div>

        {/* Premium Plan */}
        <div className="bg-[#FDC374] rounded-2xl shadow-lg px-8 py-10  text-center">
          <h2 className="text-4xl font-bold text-center mb-3">Premium Plan</h2>
          <p className="text-sm mb-4">
            Pet owners, you can speak to the AI expert to ask unlimited numbers
            of questions and get all of your important details for your
            questions answered 24 hours a day and seven days a week
          </p>
          <ul className="list-disc list-inside text-sm text-left space-y-1 mb-4">
            <li>24/7 access</li>
            <li>Emergency Advice</li>
            <li>Conversational AI</li>
            <li>Food, allergy advice</li>
            <li>Exercise advice</li>
            <li>Bathing & skin care advice</li>
            <li>Poison control assistance</li>
            <li>Grooming advice</li>
            <li>Includes 3,000 minutes of talk</li>
          </ul>
          <p className="text-4xl font-bold text-center mb-4">$29.99 month</p>
          <button  className="inline-flex text-xl mt-4 items-center justify-center rounded-full px-7 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all hover:scale-105 text-center cursor-pointer" onClick={() => openModal("premium")}>
            JOIN NOW
          </button>
        </div>

        {/* Professional Plan */}
        <div className="bg-[#FDC374] rounded-2xl shadow-lg px-8 py-10 text-center">
          <h2 className="text-4xl font-bold text-center mb-3">
            Professional Plan
          </h2>
          <p className="text-sm mb-4">
            Doctors, this is your ultimate HANDS FREE research assistant. This
            conversational AI agent is an expert in every aspect of veterinarian
            medicine and can provide
          </p>
          <ul className="list-disc list-inside text-sm text-left space-y-1 mb-4">
            <li>24/7 access</li>
            <li>Emergency Advice</li>
            <li>Conversational AI</li>
            <li>Food, allergy advice</li>
            <li>Exercise advice</li>
            <li>Bathing & skin care advice</li>
            <li>Poison control assistance</li>
            <li>Grooming advice</li>
            <li>Includes 6,000 minutes of talk</li>
          </ul>
          <p className="text-4xl font-bold text-center mb-4">$49.99 month</p>
          <button  className="inline-flex text-xl mt-4 items-center justify-center rounded-full px-7 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all hover:scale-105 text-center cursor-pointer" onClick={() => openModal("professional")}>
            JOIN NOW
          </button>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="flex flex-row max-w-6xl mx-auto gap-10 mt-8">
        <div className="flex-1">
          <Image
            src="/phone.png"
            alt="bottom"
            width={600}
            height={600}
            className="w-[300px] h-auto"
          />
        </div>
        <div className="flex-2">
          <h2 className="text-6xl font-bold leading-[60px] mb-4 ">
            Get the answers to your veterinarian questions Anytime, Anywhere!
          </h2>
          <p className="text-lg leading-relaxed text-justify">
            This website offers the ability to have a conversation with an
            artificial intelligence veterinarian medicine expert. Once you
            activate your account, you will have the ability to have
            conversations anytime of the day or night right from your mobile
            phone or desktop computer. This website is directly connected with
            ChatGPT and other amazing artificial intelligence databases. Whether
            you're asking a general question about your pets health or you have
            an emergency, this website will be able to provide you all of the
            answers to your questions day or night. This is not a replacement
            for your veterinarian, but this website will be able to provide you
            instant information and help you analyze the most basic pet care as
            well as provide you emergency guidance when you need it, including
            providing you with veterinarians and emergency medicine locations
            near you wherever you are at.
          </p>
          <Link
                href="/profile"
                className="inline-flex text-xl mt-4 items-center justify-center rounded-full px-7 py-3 text-white font-semibold shadow-lg bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all hover:scale-105 text-center cursor-pointer"
              >
                JOIN NOW
              </Link>
        </div>
      </div>
      <PaymentModal
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        plan={selectedPlan}
        userId={userId}
      />
    </div>
  );
}
