"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BsCreditCard,
  BsClock,
  BsCheckCircle,
  BsPlus,
  BsChat,
} from "react-icons/bs";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import ChatMenu from "../components/chat/ChatMenu";
import PaymentModal from "../components/payment/PaymentModal";
import PackagesModal from "../components/payment/Packages";
import Packages from "../components/payment/Packages";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [loadingPaymentMethods, setLoadingPaymentMethods] = useState(false);
  const [updatingRenewal, setUpdatingRenewal] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [latestSubscription, setLatestSubscription] = useState<any>(null);
  const [loadingSubscription, setLoadingSubscription] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showMinutesModal, setShowMinutesModal] = useState(false);
  const [xeno, setXeno] = useState<any>(false);
  const [remainingMinutes, setRemainingMinutes] = useState(0);
  const [selectedPlan, setSelectedPlan] = useState<
    "basic" | "premium" | "professional" | null
  >(null);

  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "Unknown") return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);

    return `${month}/${day}/${year}`;
  };

  // Redirect to login if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    }
  }, [status, router]);

  // Fetch data when session is available
  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchPaymentMethods(session.user.id);
      fetchLatestSubscription(session.user.id);
      fetchRemainingMinutes(session.user.id);
      fetchProfileImage(session.user.id);
    }
  }, [status, session, xeno]);

  const fetchLatestSubscription = async (userId: string) => {
    setLoadingSubscription(true);
    try {
      const response = await fetch(
        `/api/subscriptions/latest?userId=${userId}`
      );
      const data = await response.json();

      if (response.ok && data.subscription) {
        setLatestSubscription(data.subscription);
      }
    } catch (error) {
      console.error("Error fetching latest subscription:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const fetchRemainingMinutes = async (userId: string) => {
    setLoadingSubscription(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (response.ok && data.total_time !== undefined) {
        setRemainingMinutes(data.total_time);
      }
    } catch (error) {
      console.error("Error fetching remaining minutes:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const fetchProfileImage = async (userId: string) => {
    setLoadingSubscription(true);
    try {
      const response = await fetch(`/api/users/${userId}`);
      const data = await response.json();

      if (response.ok && data.profileImage) {
        setProfileImage(data.profileImage);
      }
    } catch (error) {
      console.error("Error fetching profile image:", error);
    } finally {
      setLoadingSubscription(false);
    }
  };

  const logout = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const fetchPaymentMethods = async (userId: string) => {
    if (!userId) return;

    setLoadingPaymentMethods(true);
    try {
      const response = await fetch("/api/payments/get-payment-methods", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await response.json();
      if (data.paymentMethods) {
        setPaymentMethods(data.paymentMethods);
      }
    } catch (error) {
      console.error("Failed to fetch payment methods:", error);
    } finally {
      setLoadingPaymentMethods(false);
    }
  };

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file || !session?.user?.id) return;

    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append("image", file);
      formData.append("userId", session.user.id);

      const response = await fetch("/api/profile/upload-image", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setProfileImage(data.imageUrl);
        // Optionally refresh the page to get updated session
        router.refresh();
      } else {
        console.error("Failed to upload image:", data.error);
        alert("Failed to upload image. Please try again.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      alert("Error uploading image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const updateRenewalSetting = async (renew: boolean) => {
    if (!session?.user?.id) return;

    setUpdatingRenewal(true);
    try {
      const response = await fetch("/api/update-renewal", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: session.user.id,
          renew: renew,
        }),
      });

      if (response.ok) {
        // Refresh to get updated session data
        router.refresh();
      } else {
        console.error("Failed to update renewal setting");
      }
    } catch (error) {
      console.error("Error updating renewal setting:", error);
    } finally {
      setUpdatingRenewal(false);
    }
  };

  const openModal = (plan: "basic" | "premium" | "professional") => {
    setSelectedPlan(plan);
    setIsModalOpen(true);
  };
  const onPaymentSuccess = () => {
    setIsModalOpen(false);
    router.refresh();
  };

  // Show loading state while checking authentication
  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#B57DFF]/20 via-white to-[#B57DFF]/20 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-[#B57DFF] mx-auto mb-4"></div>
          <p className="text-lg text-slate-600">Loading your profile...</p>
        </div>
      </div>
    );
  }

  // Don't render if not authenticated (will redirect)
  if (status === "unauthenticated") {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#B57DFF]/20 via-white to-[#B57DFF]/20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#B57DFF] to-[#B57DFF]">
        <div className="absolute inset-0 bg-[url('/lady.png')] bg-no-repeat bg-bottom-right bg-auto lg:bg-contain" />
        <div className="absolute inset-0 bg-black/20" />
        <ChatMenu />

        {/* Back Button */}
        {/* <div className="absolute top-6 left-6 z-50">
          <Link
            href="/"
            className="group flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </div>
            <span className="text-sm font-semibold tracking-wide">Back to Home</span>
          </Link>
        </div> */}

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/30 flex items-center justify-center text-6xl font-bold text-white shadow-2xl overflow-hidden">
                {profileImage ? (
                  <img
                    src={profileImage}
                    alt={`${session?.user?.name || "User"}'s profile`}
                    className="w-full h-full object-cover"
                  />
                ) : session?.user?.name ? (
                  session.user.name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <label className="cursor-pointer">
                  <svg
                    className="w-4 h-4 text-[#B57DFF]"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
              {uploadingImage && (
                <div className="absolute inset-0 w-32 h-32 rounded-full bg-black/50 flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                </div>
              )}
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Welcome back, {session?.user?.name || "Pet Lover"}!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Manage your account and discover personalized pet care experiences
            </p>
            <div className="text-center flex items-center justify-center mt-6">
              <Link
                href="/chat"
                className="w-[300px] flex items-center justify-center px-5 py-5  font-large text-xl text-white bg-gradient-to-r from-[#B57DFF] to-[#B57DFF] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#B57DFF] transition-all duration-200 transform hover:scale-105"
              >
                <BsChat className="w-6 h-6 mr-2" />
                Chat with Your AI Vet
              </Link>
            </div>
          </div>
        </div>

        <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Main Content */}
      <section className="relative -mt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Profile Info */}
            <div className="lg:col-span-2 space-y-8">
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Account Information
                  </h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">
                        Full Name
                      </label>
                      <div className="text-lg font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        {session?.user?.name || "Not set"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">
                        Email Address
                      </label>
                      <div className="text-lg font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        {session?.user?.email || "Not set"}
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-600">
                        Member Since
                      </label>
                      <div className="text-lg font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        {formatDate(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods Section */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-8">
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">
                    Payment Methods
                  </h2>

                  {loadingPaymentMethods ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
                      <span className="ml-3 text-slate-600">
                        Loading payment methods...
                      </span>
                    </div>
                  ) : paymentMethods.length > 0 ? (
                    <div className="space-y-4">
                      {paymentMethods.map((pm) => (
                        <div
                          key={pm.id}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                              <BsCreditCard className="w-5 h-5 text-[#B57DFF]" />
                            </div>
                            <div>
                              <p className="font-medium text-slate-900 capitalize">
                                {pm.card.brand} ending in {pm.card.last4}
                              </p>
                              <p className="text-sm text-slate-600">
                                Expires {pm.card.exp_month}/{pm.card.exp_year}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center">
                            <BsCheckCircle className="w-5 h-5 text-green-500" />
                            <span className="ml-2 text-sm font-medium text-green-600">
                              Default
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BsCreditCard className="w-12 h-12 text-slate-400 mx-auto mb-4" />
                      <p className="text-slate-600 mb-2">
                        No payment methods found
                      </p>
                      <p className="text-sm text-slate-500">
                        Payment methods will appear here after making a purchase
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Account Stats
                  </h3>

                  <div className="space-y-4">
                    {/* <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#B57DFF]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Profile Complete</p>
                          <p className="text-xs text-slate-600">100%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-[#B57DFF]" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Member Since</p>
                          <p className="text-xs text-slate-600">{formatDate(parsedUserData?.createdAt) || "Unknown"}</p>
                        </div>
                      </div>
                    </div> */}
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#B57DFF]"
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z"
                              clipRule="evenodd"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Remaining Minutes
                          </p>
                          <p className="text-xs text-slate-600">
                            {remainingMinutes || "0"} minutes
                          </p>
                        </div>
                      </div>
                    </div>
                    <button
                      // href="/transactions"
                      onClick={() => setShowMinutesModal(true)}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#B57DFF] to-[#B57DFF] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#B57DFF] transition-all duration-200 transform hover:scale-105"
                    >
                      <BsPlus className="w-4 h-4 mr-2" />
                      Add More Minutes
                    </button>
                  </div>
                </div>
              </div>

              {/* Subscription Settings */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Subscription Details
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100 m-0">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                          <svg
                            className="w-5 h-5 text-[#B57DFF]"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                            />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">
                            Monthly Renewal
                          </p>
                          <p className="text-xs text-slate-600">
                            {session?.user?.renew !== false
                              ? "Automatically renew subscription"
                              : "Manual renewal only"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <button
                          onClick={() =>
                            updateRenewalSetting(!session?.user?.renew)
                          }
                          disabled={updatingRenewal}
                          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 ${
                            session?.user?.renew !== false
                              ? "bg-purple-500"
                              : "bg-gray-200"
                          } ${
                            updatingRenewal
                              ? "opacity-50 cursor-not-allowed"
                              : "cursor-pointer"
                          }`}
                        >
                          <span
                            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                              session?.user?.renew !== false
                                ? "translate-x-6"
                                : "translate-x-1"
                            }`}
                          />
                        </button>
                        {updatingRenewal && (
                          <div className="ml-2 animate-spin rounded-full h-4 w-4 border-b-2 border-orange-500"></div>
                        )}
                      </div>
                    </div>

                    {latestSubscription && (
                      <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-50 to-purple-100">
                        <div className="flex items-center space-x-3">
                          <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center">
                            <svg
                              className="w-5 h-5 text-[#B57DFF]"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-slate-900">
                              {latestSubscription.planDetails?.name ||
                                latestSubscription.plan}
                            </p>
                            <p className="text-xs text-slate-600">
                              {formatDate(latestSubscription.createdAt)}
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-slate-900">
                            ${(latestSubscription.amount / 100).toFixed(2)}
                            <br />
                            <p className="text-xs text-slate-600">
                              {latestSubscription.planDetails?.minutes
                                ? `${latestSubscription.planDetails.minutes} Minutes Talk Time`
                                : "Talk Time Included"}
                            </p>
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Account Actions */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">
                    Account Actions
                  </h3>

                  <div className="space-y-3">
                    {latestSubscription ? (
                      // If latestSubscription is truthy (your original 'if' block)
                      <Link
                        href="/transactions"
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#B57DFF] to-[#B57DFF] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#B57DFF] transition-all duration-200 transform hover:scale-105"
                      >
                        <BsCreditCard className="w-4 h-4 mr-2" />
                        View Transactions
                      </Link>
                    ) : (
                      // If latestSubscription is falsy (your 'else' block)
                      <Link
                        href="/#plans"
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#B57DFF] to-[#B57DFF] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#B57DFF] transition-all duration-200 transform hover:scale-105"
                      >
                        <BsCreditCard className="w-4 h-4 mr-2" />
                        Buy a Plan Now
                      </Link>
                    )}
                    {/* <form action="/api/auth/logout" method="post" className="w-full"> */}
                    <button
                      onClick={logout}
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                    >
                      <svg
                        className="w-4 h-4 mr-2"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                        />
                      </svg>
                      Sign Out
                    </button>
                    {/* </form> */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      <PaymentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        plan={selectedPlan}
        userId={session?.user?.id || ""}
        onPaymentSuccess={onPaymentSuccess}
      />

      {showMinutesModal && (
        <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-black/80 z-50">
          <div className="relative">
            {/* Close button */}
            <button
              onClick={() => setShowMinutesModal(false)}
              className="absolute -top-2 -right-2 z-10 bg-red-500 hover:bg-red-600 rounded-full p-2 text-white transition-colors"
              title="Close"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <Packages
              userId={session?.user?.id || ""}
              currentMinutes={remainingMinutes}
              onPaymentSuccess={() => {
                setShowMinutesModal(false);
                setXeno(!xeno);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
