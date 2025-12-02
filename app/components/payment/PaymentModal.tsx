"use client";
import { useState, useEffect, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";
// Initialize Stripe
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!
);

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: "basic" | "premium" | "professional" | null;
  userId: string;
  onPaymentSuccess?: () => void;
}

const PLAN_DETAILS = {
  basic: { name: "Basic", price: "$9.99/month" },
  premium: { name: "Premium", price: "$19.99/month" },
  professional: { name: "Professional", price: "$29.99/month" },
};

const CardForm = ({
  plan,
  userId,
  onClose,
  clientSecret,
  paymentMethods,
  useNewCard,
  setUseNewCard,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
  onPaymentSuccess,
}: {
  plan: string;
  userId: string;
  onClose: () => void;
  clientSecret: string;
  paymentMethods: any[];
  useNewCard: boolean;
  setUseNewCard: (value: boolean) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
  onPaymentSuccess?: () => void;
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !clientSecret) {
      setError("Payment system not ready");
      return;
    }

    // Validate based on payment method choice
    if (useNewCard) {
      if (!elements || !cardholderName.trim()) {
        setError("Please fill in all fields");
        return;
      }

      const cardElement = elements.getElement(CardElement);
      if (!cardElement) {
        setError("Card element not found");
        return;
      }
    } else {
      if (!selectedPaymentMethod) {
        setError("Please select a payment method");
        return;
      }
    }

    setLoading(true);
    setError(null);

    try {
      let paymentIntent;

      if (useNewCard) {
        // Confirm the payment intent with new card element
        if (!elements) {
          setError("Payment elements not ready");
          return;
        }

        const cardElement = elements.getElement(CardElement);

        const { error: confirmError, paymentIntent: pi } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: {
              card: cardElement!,
              billing_details: {
                name: cardholderName,
              },
            },
          });

        if (confirmError) {
          setError(confirmError.message || "Payment confirmation failed");
          return;
        }

        paymentIntent = pi;
      } else {
        // Confirm the payment intent with saved payment method
        const { error: confirmError, paymentIntent: pi } =
          await stripe.confirmCardPayment(clientSecret, {
            payment_method: selectedPaymentMethod,
          });

        if (confirmError) {
          setError(confirmError.message || "Payment confirmation failed");
          return;
        }

        paymentIntent = pi;
      }

      if (paymentIntent && paymentIntent.status === "succeeded") {
        let total_time = "";
        if (plan === "basic") {
          total_time = "30";
        } else if (plan === "premium") {
          total_time = "90";
        }

        // Process the successful payment
        const response = await fetch("/api/payments/checkout", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            paymentIntentId: paymentIntent.id,
            userId,
            total_time,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Payment processing failed");
          return;
        }

        if (data.success) {
          // alert("Payment successful! Your subscription is now active.");
          onClose();
          onPaymentSuccess?.(); // Call the callback to close the modal in VoiceChat
          router.push("/chat"); // Refresh to show updated subscription status
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
      {/* Payment Method Selection */}
      {paymentMethods.length > 0 && (
        <div className="space-y-3">
          <label className="block text-sm font-medium text-gray-700">
            Payment Method
          </label>

          {/* Toggle between saved methods and new card */}
          <div className="flex gap-4 mb-4">
            <button
              type="button"
              onClick={() => setUseNewCard(false)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                !useNewCard
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Use Saved Card
            </button>
            <button
              type="button"
              onClick={() => setUseNewCard(true)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                useNewCard
                  ? "bg-purple-500 text-white"
                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
              }`}
            >
              Use New Card
            </button>
          </div>

          {/* Saved Payment Methods */}
          {!useNewCard && (
            <div className="space-y-2">
              {paymentMethods.map((pm) => (
                <label
                  key={pm.id}
                  className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50"
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={selectedPaymentMethod === pm.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3 text-[#B57DFF] focus:ring-orange-500"
                  />
                  <div className="flex-1">
                    <div className="font-medium capitalize">
                      {pm.card.brand} ending in {pm.card.last4}
                    </div>
                    <div className="text-sm text-gray-500">
                      Expires {pm.card.exp_month}/{pm.card.exp_year}
                    </div>
                  </div>
                </label>
              ))}
            </div>
          )}
        </div>
      )}

      {/* New Card Form */}
      {useNewCard && (
        <>
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
        </>
      )}

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
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 001 1V6a1 1 0 00-1-1z"
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
          disabled={loading || (!useNewCard && !selectedPaymentMethod)}
        >
          {loading
            ? "Processing..."
            : `Pay ${PLAN_DETAILS[plan as keyof typeof PLAN_DETAILS]?.price}`}
        </button>
      </div>
    </form>
  );
};

export default function PaymentModal({
  isOpen,
  onClose,
  plan,
  userId,
  onPaymentSuccess,
}: PaymentModalProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [useNewCard, setUseNewCard] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] =
    useState<string>("");
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<string>("");

  // Redirect to login if userId is empty
  useEffect(() => {
    if (isOpen && (!userId || userId.trim() === "")) {
      // alert("Please log in to make a payment");
      // Swal.fire({
      //   icon: "info",
      //   title: "Welcome to PetCare!",
      //   text: "Create an account to make a payment",
      //   timer: 2000,
      //   showConfirmButton: false,
      //   showCloseButton: false,

      // });
      router.push("/signup");
      onClose();
      return;
    }
  }, [isOpen, userId, router, onClose]);

  useEffect(() => {
    // Create PaymentIntent as soon as the modal opens
    if (isOpen && plan && userId && userId.trim() !== "") {
      setCurrentPlan(plan);
      fetch("/api/payments/create-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ plan, userId }),
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

  // Fetch payment methods when modal opens
  useEffect(() => {
    if (isOpen && userId && userId.trim() !== "") {
      setLoadingPaymentMethods(true);
      fetch("/api/payments/get-payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.paymentMethods) {
            setPaymentMethods(data.paymentMethods);
            if (data.paymentMethods.length > 0) {
              setSelectedPaymentMethod(data.paymentMethods[0].id);
              setUseNewCard(false);
            } else {
              setUseNewCard(true);
            }
          }
        })
        .catch((err) => console.error("Failed to fetch payment methods:", err))
        .finally(() => setLoadingPaymentMethods(false));
    }
  }, [isOpen, userId]);

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  // Memoize options to prevent unnecessary re-renders
  const memoizedOptions = useMemo(() => options, [clientSecret]);

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 p-4 flex justify-center items-center w-full h-full">
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
          <Elements options={memoizedOptions} stripe={stripePromise}>
            <CardForm
              plan={plan}
              userId={userId}
              onClose={onClose}
              clientSecret={clientSecret}
              paymentMethods={paymentMethods}
              useNewCard={useNewCard}
              setUseNewCard={setUseNewCard}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
              onPaymentSuccess={onPaymentSuccess}
            />
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
