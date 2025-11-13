"use client";
import { useState, useEffect } from "react";
import { BsClock, BsPlus, BsLightning } from "react-icons/bs";
import MinutesPaymentModal from "../components/MinutesPaymentModal";

interface MinutesSectionProps {
  userId: string;
  currentMinutes?: number; // Make this optional since we'll manage our own state
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

export default function MinutesSection({ userId, currentMinutes: initialMinutes, onPaymentSuccess }: MinutesSectionProps) {
  const [currentMinutes, setCurrentMinutes] = useState(initialMinutes || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMinutes, setSelectedMinutes] = useState<"20" | "40" | "60" | null>(null);
  const [hasSubscription, setHasSubscription] = useState(false);

  // Fetch current minutes from localStorage
  const fetchCurrentMinutes = async () => {
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        const parsed = JSON.parse(userData);
        console.log(parsed);
        // setCurrentMinutes(parsed.data?.total_time || 0);
        const userId = parsed?.id; // 👈 get user ID from stored data

      if (!userId) {
        console.error("User ID not found in localStorage data");
        return;
      }

      // ✅ fetch from your backend
      const res = await fetch(`/api/users/${userId}`);
      const data = await res.json();

      if (!res.ok) {
        console.error("Failed to fetch user data:", data);
        return;
      }

      // ✅ set total_time from DB instead of localStorage
      setCurrentMinutes(data.total_time || 0);
      } catch (e) {
        console.error("Failed to parse user_data from localStorage", e);
      }
    }
  };

  // Check if user has subscription
  const checkSubscription = async () => {
    if (userId) {
      try {
        const response = await fetch(`/api/check-subscription?userId=${userId}`);
        const data = await response.json();
        setHasSubscription(data.hasTransaction || false);
      } catch (error) {
        console.error('Error checking subscription:', error);
        setHasSubscription(false);
      }
    }
  };

  // Fetch minutes on mount and when payment succeeds
  useEffect(() => {
    fetchCurrentMinutes();
    checkSubscription();
    
    // Set up interval to refresh data every 3 minutes (180000 ms)
    const interval = setInterval(() => {
      fetchCurrentMinutes();
      checkSubscription();
    }, 120000); // 3 minutes = 3 * 60 * 1000 ms
    
    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, [userId]);

  const handlePurchase = (minutes: "20" | "40" | "60") => {
    setSelectedMinutes(minutes);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedMinutes(null);
  };

  const handlePaymentSuccess = () => {
    // Refetch minutes after successful payment
    fetchCurrentMinutes();
    onPaymentSuccess?.();
  };

  // Only show if user has subscription
  

  return (
    <>
      <div className="mb-8">
        {/* Current Minutes Display */}
        {/* <div className="relative rounded-2xl border border-white/30 bg-white backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden mb-6">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
          <div className="p-6">
            <div className="flex items-center justify-between ">
              <div className="flex items-center space-x-4 ">
                <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                  <BsClock className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-slate-900">
                    Available Minutes
                  </h3>
                  <p className="text-sm text-slate-600">
                    Use these minutes for AI chat consultations
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-3xl font-bold text-slate-900">
                  {currentMinutes || 0}
                </div>
                <div className="text-sm text-slate-600">
                  minutes remaining
                </div>
              </div>
            </div>
          </div>
        </div> */}
       
    
 
        {/* Purchase Minutes Section */}
        <div className="relative rounded-sm bg-[#B57DFF] backdrop-blur-xl  overflow-hidden ${
    !userSubscription.hasActiveSubscription ? 'hidden' : ''
  }`">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
          <div className="p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-slate-900 mb-2">
                Purchase Chat Minutes
              </h2>
              <p className="text-slate-600">
                Add minutes to your account for AI-powered pet care consultations
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-4 mt-10">
              {MINUTES_PACKAGES.map((pkg) => (
                <div
                  key={pkg.minutes}
                  className={`relative rounded-xl shadow-xl px-6 pb-6 pt-8 mt-8 md:mt-4 transition-all  cursor-pointer`}
                  onClick={() => handlePurchase(pkg.minutes as "20" | "40" | "60")}
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
                    {/* <div className="w-12 h-12 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                      <BsClock className="w-6 h-6 text-orange-600" />
                    </div> */}
                    
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
                      Purchase Now
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* <div className="mt-6 text-center">
              <p className="text-sm text-slate-500">
                💳 Secure payment powered by Stripe • Minutes never expire
              </p>
            </div> */}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      <MinutesPaymentModal
        isOpen={isModalOpen}
        onClose={closeModal}
        minutes={selectedMinutes}
        userId={userId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
