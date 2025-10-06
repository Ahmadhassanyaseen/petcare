"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Swal from "sweetalert2";
import { BsCheckCircle } from "react-icons/bs";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const sessionId = searchParams.get("session_id");

  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sessionId) {
      setError("Missing session ID.");
      setLoading(false);
      return;
    }

    // Fetch checkout session details from our backend
    const fetchSession = async () => {
      try {
        const res = await fetch("/api/verify-subscription", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ sessionId }),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Failed to verify subscription.");
        }

        setSubscription(data.subscription);
        Swal.fire({
          icon: "success",
          title: "Subscription Activated!",
          text: `You’re now subscribed to the ${data.minutes} minute plan.`,
          timer: 3000,
          timerProgressBar: true,
          showConfirmButton: false,
        });
      } catch (err: any) {
        setError(err.message || "Failed to verify subscription.");
      } finally {
        setLoading(false);
      }
    };

    fetchSession();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-500"></div>
        <p className="text-gray-600 mt-3">Verifying your subscription...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-screen text-center">
        <p className="text-red-600 font-medium text-lg mb-2">Subscription Error</p>
        <p className="text-gray-600">{error}</p>
        <button
          onClick={() => router.push("/")}
          className="mt-6 px-5 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen text-center">
      <BsCheckCircle className="text-green-500 w-20 h-20 mb-4" />
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Subscription Successful!</h1>
      <p className="text-gray-600 mb-6">
        You are now subscribed to the <b>{subscription?.planName || subscription?.minutes}</b> minutes plan.
      </p>
      <button
        onClick={() => router.push("/dashboard")}
        className="px-6 py-3 bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] text-white rounded-lg font-semibold hover:scale-105 transition-all"
      >
        Go to Dashboard
      </button>
    </div>
  );
}
