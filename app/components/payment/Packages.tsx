"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { BsLightning, BsPlus } from "react-icons/bs";
import PackagesPaymentModal from "@/app/components/payment/PackagesPaymentModal";

interface MinutesSectionProps {
  userId: string;
  currentMinutes: number;
  onPaymentSuccess?: () => void;
}

export default function Packages({
  userId,
  currentMinutes: initialMinutes,
  onPaymentSuccess,
}: MinutesSectionProps) {
  const { data: session } = useSession();
  const [currentMinutes, setCurrentMinutes] = useState(initialMinutes || 0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<any>(null);
  const [packages, setPackages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Update minutes from session
  useEffect(() => {
    if (session?.user?.total_time !== undefined) {
      setCurrentMinutes(session.user.total_time);
    }
  }, [session?.user?.total_time]);

  useEffect(() => {
    fetch("/api/packages")
      .then((res) => res.json())
      .then((data) => {
        setPackages(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch packages", err);
        setLoading(false);
      });
  }, []);

  const handlePurchase = (pkg: any) => {
    setSelectedPackage(pkg);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedPackage(null);
  };

  const handlePaymentSuccess = () => {
    // Trigger parent callback to refresh data
    onPaymentSuccess?.();
    closeModal();
  };

  if (loading)
    return <div className="text-center py-10">Loading packages...</div>;

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
              {packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className={`relative rounded-xl shadow-xl px-6 pb-6 pt-8 mt-8 md:mt-4 transition-all cursor-pointer bg-gradient-to-r from-purple-50 to-purple-100 hover:scale-105`}
                  onClick={() => handlePurchase(pkg)}
                >
                  {pkg.isPopular && (
                    <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                      <div className="bg-black text-white px-3 py-1 rounded-full text-xs font-semibold flex items-center">
                        <BsLightning className="w-3 h-3 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}

                  <div className="text-center">
                    <h3 className="text-xl font-bold text-slate-900 mb-2">
                      {pkg.minutes} Minutes
                    </h3>

                    <div className="text-3xl font-bold text-black mb-2">
                      ${(pkg.price / 100).toFixed(2)}
                    </div>

                    <p className="text-sm text-slate-600 mb-4">
                      {pkg.description}
                    </p>

                    <button
                      className={`w-full py-3 px-4 rounded-lg font-semibold transition-all ${
                        pkg.isPopular
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
        pkg={selectedPackage}
        userId={userId}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </>
  );
}
