"use client";
import Swal from 'sweetalert2';
import { useState, useEffect, useMemo } from "react";
import { loadStripe, StripeElementsOptions } from "@stripe/stripe-js";
import {
  Elements,
  CardElement,
  useStripe,
  useElements,
} from "@stripe/react-stripe-js";
import { useRouter } from "next/navigation";
import { BsClock, BsX } from "react-icons/bs";

// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface MinutesPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: "20" | "40" | "60" | null;
  userId: string;
  onPaymentSuccess?: () => void;
}

const MINUTES_PACKAGES = {
  "20": { minutes: 20, price: "$4.99", description: "Perfect for quick consultations" },
  "40": { minutes: 40, price: "$9.99", description: "Great for detailed discussions" },
  "60": { minutes: 60, price: "$14.99", description: "Best value for comprehensive care" },
};

const CardForm = ({ 
  minutes, 
  userId, 
  onClose, 
  clientSecret,
  onPaymentSuccess,
  paymentMethods,
  useNewCard,
  setUseNewCard,
  selectedPaymentMethod,
  setSelectedPaymentMethod,
}: { 
  minutes: string; 
  userId: string; 
  onClose: () => void; 
  clientSecret: string;
  onPaymentSuccess?: () => void;
  paymentMethods: any[];
  useNewCard: boolean;
  setUseNewCard: (value: boolean) => void;
  selectedPaymentMethod: string;
  setSelectedPaymentMethod: (value: string) => void;
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
        const cardElement = elements?.getElement(CardElement);

        if (!cardElement) {
          setError("Card element not found");
          return;
        }

        const { error: confirmError, paymentIntent: pi } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: {
            card: cardElement!,
            billing_details: {
              name: cardholderName,
            },
          },
        });

        if (confirmError) {
          console.error("Stripe confirmation error:", confirmError);
          setError(confirmError.message || "Payment confirmation failed");
          return;
        }

        console.log("Payment confirmation successful:", {
          paymentIntentId: pi?.id,
          status: pi?.status,
          paymentMethod: pi?.payment_method,
        });

        paymentIntent = pi;
      } else {
        // Confirm the payment intent with saved payment method
        const { error: confirmError, paymentIntent: pi } = await stripe.confirmCardPayment(clientSecret, {
          payment_method: selectedPaymentMethod,
        });

        if (confirmError) {
          setError(confirmError.message || "Payment confirmation failed");
          return;
        }

        paymentIntent = pi;
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
          // Update localStorage with new minutes
          const currentUserData = localStorage.getItem("user_data");
          if (currentUserData) {
            try {
              const userData = JSON.parse(currentUserData);
              if (userData && userData.data) {
                userData.data.total_time = (userData.data.total_time || 0) + parseInt(minutes);
                localStorage.setItem("user_data", JSON.stringify(userData));
              }
            } catch (error) {
              console.error("Failed to update localStorage:", error);
            }
          }

          // Close modal immediately after successful payment
          onClose();
          onPaymentSuccess?.(); // Close the parent modal in VoiceChat
          router.refresh(); // Refresh to show updated minutes

          // Show success message after modal is closed
          setTimeout(() => {
            Swal.fire({
              icon: 'success',
              title: 'Payment Successful!',
              text: `${data.minutesAdded} minutes have been added to your account.`,
              timer: 3000,
              timerProgressBar: true,
              showConfirmButton: false,
            });
          }, 100);
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

  const packageInfo = MINUTES_PACKAGES[minutes as keyof typeof MINUTES_PACKAGES];

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
                  ? "bg-orange-500 text-white"
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
                  ? "bg-orange-500 text-white"
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
                <label key={pm.id} className="flex items-center p-3 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
                  <input
                    type="radio"
                    name="paymentMethod"
                    value={pm.id}
                    checked={selectedPaymentMethod === pm.id}
                    onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    className="mr-3 text-orange-500 focus:ring-orange-500"
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
          disabled={loading || (!useNewCard && !selectedPaymentMethod)}
        >
          {loading ? "Processing..." : `Pay ${packageInfo?.price}`}
        </button>
      </div>
    </form>
  );
};

export default function MinutesPaymentModal({ isOpen, onClose, minutes, userId, onPaymentSuccess }: MinutesPaymentModalProps) {
  const router = useRouter();
  const [clientSecret, setClientSecret] = useState("");
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [useNewCard, setUseNewCard] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string>("");
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);

  // Redirect to login if userId is empty
  useEffect(() => {
    if (isOpen && (!userId || userId.trim() === "")) {
      alert("Please log in to purchase minutes");
      router.push("/login");
      onClose();
      return;
    }
  }, [isOpen, userId, router, onClose]);

  useEffect(() => {
    // Create PaymentIntent as soon as the modal opens
    if (isOpen && minutes && userId && userId.trim() !== "") {
      fetch("/api/create-minutes-payment-intent", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ minutes, userId }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.clientSecret) {
            setClientSecret(data.clientSecret);
          }
        })
        .catch((err) => console.error("Failed to create payment intent:", err));
    }
  }, [isOpen, minutes, userId]);

  // Fetch payment methods when modal opens
  useEffect(() => {
    if (isOpen && userId && userId.trim() !== "") {
      setLoadingPaymentMethods(true);
      console.log("Fetching payment methods for userId:", userId);
      fetch("/api/get-payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      })
        .then((res) => {
          console.log("Response status:", res.status);
          console.log("Response headers:", Object.fromEntries(res.headers.entries()));
          return res.json();
        })
        .then((data) => {
          console.log("Full payment methods response:", JSON.stringify(data, null, 2));
          if (data.paymentMethods) {
            setPaymentMethods(data.paymentMethods);
            if (data.paymentMethods.length > 0) {
              setSelectedPaymentMethod(data.paymentMethods[0].id);
              setUseNewCard(false);
            } else {
              setUseNewCard(true);
            }
          } else {
            console.log("No paymentMethods property in response");
          }
        })
        .catch((err) => {
          console.error("Failed to fetch payment methods:", err);
        })
        .finally(() => setLoadingPaymentMethods(false));
    }
  }, [isOpen, userId]);

  // Memoize options to prevent unnecessary re-renders - must be before early return
  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

  const memoizedOptions = useMemo(() => options, [clientSecret]);

  if (!isOpen || !minutes) return null;

  const packageInfo = MINUTES_PACKAGES[minutes as keyof typeof MINUTES_PACKAGES];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <BsX className="w-6 h-6" />
        </button>

        <div className="text-center mb-6">
          <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
            <BsClock className="w-8 h-8 text-orange-600" />
          </div>
          <h2 className="text-2xl font-bold mb-2">
            Purchase {packageInfo?.minutes} Minutes
          </h2>
          <p className="text-gray-600 mb-2">
            {packageInfo?.price}
          </p>
          <p className="text-sm text-gray-500">
            {packageInfo?.description}
          </p>
        </div>

        {clientSecret ? (
          <Elements options={memoizedOptions} stripe={stripePromise}>
            <CardForm
              minutes={minutes}
              userId={userId}
              onClose={onClose}
              clientSecret={clientSecret}
              onPaymentSuccess={onPaymentSuccess}
              paymentMethods={paymentMethods}
              useNewCard={useNewCard}
              setUseNewCard={setUseNewCard}
              selectedPaymentMethod={selectedPaymentMethod}
              setSelectedPaymentMethod={setSelectedPaymentMethod}
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
