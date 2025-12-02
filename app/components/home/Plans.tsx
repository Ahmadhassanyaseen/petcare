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
import PaymentModal from "@/app/components/payment/PaymentModal";
import { useSession } from "next-auth/react";

const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

const CardForm = ({
  minutes,
  userId,
  onClose,
  clientSecret,
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
      const { error: confirmError, paymentIntent } =
        await stripe.confirmCardPayment(clientSecret, {
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
        const response = await fetch("/api/minutes/purchased", {
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
          alert(
            `Payment successful! ${data.minutesAdded} minutes have been added to your account.`
          );
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
            <svg
              className="w-5 h-5 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
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

export default function PricingPlans({
  onPaymentSuccess,
}: PricingPlansProps = {}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const { data: session } = useSession();

  // Get userId from session
  const userId = session?.user?.id || "";

  const [plans, setPlans] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/plans")
      .then((res) => res.json())
      .then((data) => {
        setPlans(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch plans", err);
        setLoading(false);
      });
  }, []);

  const openModal = (plan: any) => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };

  if (loading) return <div className="text-center py-20">Loading plans...</div>;

  return (
    <section className="w-full bg-[#B57DFF] py-16 px-6" id="plans">
      <div className="max-w-4xl mx-auto text-center">
        {/* Heading */}
        <h2 className="text-[42px] md:text-[64px] font-extrabold leading-tight text-black text-start">
          Choose the Right Plan for <span className="">You & Your Pet</span>
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-w-6xl w-full mx-auto mt-6">
          {plans.map((plan) => (
            <div
              key={plan._id}
              className={`${
                plan.name.toLowerCase().includes("sniff")
                  ? "bg-[#ffb930]"
                  : "bg-[#47e5d2]"
              } rounded-3xl p-8 md:p-12 text-black shadow-lg flex flex-col justify-between`}
            >
              <div>
                <h2 className="text-[24px] md:text-[28px] font-extrabold mb-2 ">
                  {plan.name}
                </h2>
                <div className="border-b border-black w-70 mb-6"></div>

                <div
                  className="text-[16px] md:text-[18px] leading-relaxed mb-4"
                  dangerouslySetInnerHTML={{ __html: plan.description }}
                />
                <div className="border-b border-black w-70 mb-6"></div>

                <ul className="space-y-2 text-[16px] md:text-[18px] leading-relaxed mt-4">
                  {plan.features.map((feature: string, index: number) => (
                    <li
                      key={index}
                      dangerouslySetInnerHTML={{ __html: feature }}
                    />
                  ))}
                </ul>
              </div>

              <div className="mt-8">
                <p className="text-[20px] md:text-[22px] font-bold mb-4">
                  ${(plan.price / 100).toFixed(2)}/
                  {plan.interval === "month" ? "mo" : "yr"}
                </p>
                <button
                  onClick={() => openModal(plan)}
                  className="bg-black text-white px-6 py-3 rounded-full font-semibold text-[16px] hover:bg-gray-900 transition"
                >
                  {plan.interval === "month" ? "Join the Pack" : "Sniff It Out"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Modal */}
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        userId={userId}
        onPaymentSuccess={onPaymentSuccess}
      />
    </section>
  );
}
