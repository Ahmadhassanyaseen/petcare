"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BsClock, BsPlus, BsLightning } from "react-icons/bs";
import PackagesPaymentModal from "./PackagesPaymentModal";

interface MinutesSectionProps {
  userId: string;
  currentMinutes?: number;
  onPaymentSuccess?: () => void;
}

const MINUTES_PACKAGES = [
  {
    minutes: "20",
    amount: 20,
    price: "$4.99",
    description: "Perfect for quick consultations",
    popular: false,
  },
  {
    minutes: "40",
    amount: 40,
    price: "$9.99",
    description: "Great for detailed discussions",
    popular: true,
  },
  {
    minutes: "60",
    amount: 60,
    price: "$14.99",
    description: "Best value for comprehensive care",
    popular: false,
  },
];

export default function Packages({
  userId,
  currentMinutes: initialMinutes,
  onPaymentSuccess,
}: MinutesSectionProps) {
  const { data: session } = useSession();
  const [currentMinutes, setCurrentMinutes] = useState(initialMinutes || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<
    "20" | "40" | "60" | null
  >(null);

  // Update minutes from session
  useEffect(() => {
    if (session?.user?.total_time !== undefined) {
      setCurrentMinutes(session.user.total_time);
    }
  }, [session?.user?.total_time]);

  const handlePurchase = (minutes: "20" | "40" | "60") => {
    setSelectedMinutes(minutes);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMinutes(null);
  };

  const handlePaymentSuccess = () => {
    // Trigger parent callback to refresh data
    onPaymentSuccess?.();
    closeModal();
  };

  return (
    <>
      <div className="mb-8">
        {/* Purchase Minutes Section */}
        <div className="relative rounded-sm bg-[#B57DFF] backdrop-blur-xl overflow-hidden">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-white mb-2">
                Add Minutes To Your Account
              </h2>
              <p className="text-slate-600">
                Add minutes to your account for AI-powered pet care
                consultations. You currently have {currentMinutes || 0} minutes
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-10">
              {MINUTES_PACKAGES.map((pkg) => (
                <div
                  key={pkg.minutes}
                  className={`relative rounded-xl shadow-xl px-6 pb-6 pt-8 mt-8 md:mt-4 transition-all cursor-pointer bg-gradient-to-r from-purple-50 to-purple-100 hover:scale-105`}
                  onClick={() =>
                    handlePurchase(pkg.minutes as "20" | "40" | "60")
                  }
                >
                  {pkg.popular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <BsLightning className="w-3 h-3 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {pkg.amount} Minutes
                    </h3>

                    <div className="text-3xl font-bold text-black mb-2">
                      {pkg.price}
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                      {pkg.description}
                    </p>

                    <button
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                        pkg.popular
                          ? "bg-black text-white hover:bg-[#FFB536] hover:text-black"
                          : "bg-black text-white hover:bg-[#FFB536] hover:text-black"
                      }`}
                    >
                      <BsPlus className="w-5 h-5 inline mr-2" />
                      Add Minutes
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <PackagesPaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        minutes={selectedMinutes}
        userId={userId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
