"use client";
import { useState, useEffect } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: "basic" | "premium" | "professional" | null;
  userId: string;
}

const PLAN_DETAILS = {
  basic: { name: "Basic", price: "$9.99/month" },
  premium: { name: "Premium", price: "$29.99/month" },
  professional: { name: "Professional", price: "$49.99/month" },
};

const CardForm = ({ plan, userId, onClose, clientSecret }: { plan: string; userId: string; onClose: () => void; clientSecret: string }) => {
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
        const response = await fetch("/api/checkout", {
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
          alert("Payment successful! Your subscription is now active.");
          onClose();
          router.refresh(); // Refresh to show updated subscription status
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
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] text-white font-semibold hover:scale-105 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={loading || !stripe}
        >
          {loading ? "Processing..." : `Pay ${PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS]?.price}`}
        </button>
      </div>
    </form>
  );
};

export default function PaymentModal({ isOpen, onClose, plan, userId }: PaymentModalProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [currentPlan, setCurrentPlan] = useState<string>("");

  // Redirect to login if userId is empty
  useEffect(() => {
    if (isOpen && (!userId || userId.trim() === "")) {
      alert("Please log in to make a payment");
      router.push("/login");
      onClose();
      return;
    }
  }, [isOpen, userId, router, onClose]);

  useEffect(() => {
    // Create PaymentIntent as soon as the modal opens
    if (isOpen && plan && userId && userId.trim() !== "") {
      setCurrentPlan(plan);
      fetch("/api/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => console.error("Failed to create payment intent:", err));
    }
  }, [isOpen, plan, userId]);

  if (!isOpen || !plan) return null;

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full">
        <div className="text-center mb-6">
          <h2 className="text-2xl font-bold mb-2">
            Subscribe to {PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS]?.name}
          </h2>
          <p className="text-gray-600">
            {PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS]?.price} per month
          </p>
        </div>

        {clientSecret ? (
          <Elements options={options} stripe={stripePromise}>
            <CardForm plan={plan} userId={userId} onClose={onClose} clientSecret={clientSecret} />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Preparing payment form...</p>
          </div>
        )}
      </div>
    </div>
  );
}
