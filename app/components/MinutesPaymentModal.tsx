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
import { BsClock, BsX } from "react-icons/bs";
// Initialize Stripe
const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

interface MinutesPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  minutes: string | null;
  userId: string;
  onPaymentSuccess?: () => void;
}

interface CardData {
  _id: string;
  cardNumber: string;
  cardBrand: string;
  cardholderName?: string;
  expiryMonth: number;
  expiryYear: number;
  isDefault: boolean;
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
  defaultCard,
  paymentMethod,
  setPaymentMethod
}: { 
  minutes: string | null; 
  userId: string; 
  onClose: () => void; 
  clientSecret: string;
  onPaymentSuccess?: () => void;
  defaultCard: CardData | null;
  paymentMethod: 'default' | 'manual';
  setPaymentMethod: (method: 'default' | 'manual') => void;
}) => {
  const stripe = useStripe();
  const router = useRouter();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cardholderName, setCardholderName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (paymentMethod === 'manual' && (!stripe || !elements || !cardholderName.trim() || !clientSecret)) {
      setError("Please fill in all fields");
      return;
    }

    if (paymentMethod === 'default' && !defaultCard) {
      setError("No default card found with complete payment information. Please add a card manually or update your existing card with complete details.");
      // Automatically switch to manual entry
      setPaymentMethod('manual');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      if (paymentMethod === 'manual') {
        const cardElement = elements!.getElement(CardElement);

        if (!cardElement) {
          setError("Card element not found");
          return;
        }

        // Confirm the payment intent with card element
        const { error: confirmError, paymentIntent } = await stripe!.confirmCardPayment(clientSecret, {
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
          await processPayment(paymentIntent.id);
        }
      } else {
        // Use default card - create payment method with existing card
        const response = await fetch("/api/purchase-minutes-with-card", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            userId,
            cardId: defaultCard!._id,
            minutes,
          }),
        });

        const data = await response.json();

        if (!response.ok) {
          setError(data.error || "Payment processing failed");
          return;
        }

        if (data.success) {
          await processPayment(data.paymentIntentId);
        }
      }
    } catch (err: any) {
      console.error("Payment error:", err);
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const processPayment = async (paymentIntentId: string) => {
    // Process the successful payment
    const response = await fetch("/api/purchase-minutes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        paymentIntentId,
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
            userData.data.total_time = (userData.data.total_time || 0) + parseInt(minutes!);
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
        alert(`Payment successful! ${data.minutesAdded} minutes have been added to your account.`);
      }, 100);
    } else {
      setError("Payment processing failed");
    }
  };

  const packageInfo = MINUTES_PACKAGES[minutes as keyof typeof MINUTES_PACKAGES];

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Payment Method Selection */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Payment Method
        </label>
        <div className="space-y-3">
          <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'default' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:bg-gray-50'}`}>
            <input
              type="radio"
              value="default"
              checked={paymentMethod === 'default'}
              onChange={(e) => setPaymentMethod(e.target.value as 'default' | 'manual')}
              className="mr-3 text-orange-500"
            />
            <div className="flex-1">
              <div className="font-medium">Use Default Card</div>
              {defaultCard ? (
                <div className="text-sm text-gray-600 mt-1">
                  {defaultCard.cardBrand.toUpperCase()} ending in {defaultCard.cardNumber?.slice(-4) || '****'}
                  {defaultCard.cardholderName && ` • ${defaultCard.cardholderName}`}
                </div>
              ) : (
                <div className="text-sm text-gray-500 mt-1">
                  No complete card information available
                </div>
              )}
            </div>
          </label>

          <label className={`flex items-center p-4 border rounded-lg cursor-pointer transition-colors ${paymentMethod === 'manual' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:bg-gray-50'}`}>
            <input
              type="radio"
              value="manual"
              checked={paymentMethod === 'manual'}
              onChange={(e) => setPaymentMethod(e.target.value as 'default' | 'manual')}
              className="mr-3 text-orange-500"
            />
            <div className="font-medium">Add New Card</div>
          </label>
        </div>
      </div>

      {/* Info about card requirements */}
      {!defaultCard && (
        <div className="bg-blue-50 border border-blue-200 text-blue-700 px-4 py-3 rounded-lg text-sm">
          <div className="flex items-start">
            <svg className="w-5 h-5 mr-2 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div>
              <p className="font-medium">Card Information Required</p>
              <p className="mt-1">Default cards must have complete payment information (card number, brand, and expiry date) to be used for purchases.</p>
            </div>
          </div>
        </div>
      )}
      {paymentMethod === 'manual' && (
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

      {/* Default Card Info */}
      {paymentMethod === 'default' && defaultCard && (
        <div className="p-4 bg-gray-50 border border-gray-200 rounded-lg">
          <div className="text-sm text-gray-600 mb-2">Using your default card:</div>
          <div className="font-medium">
            {defaultCard.cardBrand.toUpperCase()} ending in {defaultCard.cardNumber?.slice(-4) || '****'}
          </div>
          {defaultCard.cardholderName && (
            <div className="text-sm text-gray-600 mt-1">
              {defaultCard.cardholderName}
            </div>
          )}
          <div className="text-xs text-gray-500 mt-2">
            Expires {String(defaultCard.expiryMonth).padStart(2, '0')}/{defaultCard.expiryYear}
          </div>
        </div>
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
          disabled={loading || (paymentMethod === 'manual' && !stripe)}
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
  const [defaultCard, setDefaultCard] = useState<CardData | null>(null);
  const [paymentMethod, setPaymentMethod] = useState<'default' | 'manual'>('default');
  const [loadingCard, setLoadingCard] = useState(false);

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
        body: JSON.stringify({ minutes }),
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

  // Fetch user's default card
  useEffect(() => {
    if (isOpen && userId && userId.trim() !== "") {
      setLoadingCard(true);
      fetch("/api/cards", {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      })
        .then((res) => {
          console.log("Response status:", res.status);
          if (!res.ok) {
            console.error("API request failed:", res.status, res.statusText);
            throw new Error(`HTTP ${res.status}: ${res.statusText}`);
          }
          return res.json();
        })
        .then((data) => {
          console.log("API Response:", data);
          if (data.cards && data.cards.length > 0) {
            console.log("Cards found:", data.cards.length);

            // Filter cards that have complete payment information
            const validCards = data.cards.filter((card: CardData) =>
              card.cardNumber && card.cardBrand && card.expiryMonth && card.expiryYear
            );

            console.log("Valid cards with complete info:", validCards.length);

            if (validCards.length > 0) {
              const defaultCardData = validCards.find((card: CardData) => card.isDefault) || validCards[0];
              setDefaultCard(defaultCardData);
            } else {
              console.warn("No cards found with complete payment information");
              // Still try to use cards marked as default even if they don't have complete info
              const defaultMarkedCard = data.cards.find((card: CardData) => card.isDefault);
              if (defaultMarkedCard) {
                console.log("Found default card but missing payment info - card may need to be updated");
                setDefaultCard(null); // Don't set as default card since it can't be used for payment
              } else {
                setDefaultCard(null);
              }
            }
          } else {
            console.warn("No cards found for user");
            setDefaultCard(null);
          }
        })
        .catch((err) => {
          console.error("Failed to fetch cards:", err);
          // If API request fails, it might be due to authentication
          if (err.message.includes('401') || err.message.includes('Unauthorized')) {
            console.error("Authentication issue - user may not be logged in");
          }
          setDefaultCard(null);
        })
        .finally(() => setLoadingCard(false));
    }
  }, [isOpen, userId]);

  if (!isOpen || !minutes) return null;

  const packageInfo = MINUTES_PACKAGES[minutes as keyof typeof MINUTES_PACKAGES];

  const options: StripeElementsOptions = {
    clientSecret,
    appearance: {
      theme: "stripe",
      labels: "floating",
    },
  };

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

        {clientSecret && !loadingCard ? (
          <Elements options={options} stripe={stripePromise}>
            <CardForm 
              minutes={minutes} 
              userId={userId} 
              onClose={onClose} 
              clientSecret={clientSecret} 
              onPaymentSuccess={onPaymentSuccess}
              defaultCard={defaultCard}
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
            />
          </Elements>
        ) : (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">{clientSecret ? 'Loading payment options...' : 'Preparing payment form...'}</p>
          </div>
        )}
      </div>
    </div>
  );
}
