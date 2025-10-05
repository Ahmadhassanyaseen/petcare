"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { BsCreditCard } from "react-icons/bs";
import { useRouter } from "next/navigation";
import CardList from "../components/cards/CardList";
import AddCardModal from "../components/cards/AddCardModal";


export default function ProfilePage() {
  const [parsedUserData, setParsedUserData] = useState<any>(null);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [cardsRefreshTrigger, setCardsRefreshTrigger] = useState(0);
  const router = useRouter();

  const formatDate = (dateString: string) => {
    if (!dateString || dateString === "Unknown") return "Unknown";
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "Unknown";

    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    const year = date.getFullYear().toString().slice(-2);

    return `${month}/${day}/${year}`;
  };

  useEffect(() => {
    // Runs only in browser
    const userData = localStorage.getItem("user_data");
    if (userData) {
      try {
        setParsedUserData(JSON.parse(userData));
      } catch (e) {
        console.error("Failed to parse user_data from localStorage", e);
      }
    }
  }, []);

  const logout = () => {
    localStorage.removeItem("user_data");
    router.push("/");
  };

  const handleCardAdded = () => {
    setCardsRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#ff4d2d] to-[#ff7a18]">
        <div className="absolute inset-0 bg-[url('/dog.png')] bg-no-repeat bg-right-bottom opacity-10" />
        <div className="absolute inset-0 bg-black/20" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-50">
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
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            {/* Avatar */}
            <div className="relative inline-block mb-8">
              <div className="w-32 h-32 rounded-full bg-white/20 backdrop-blur-xl border-4 border-white/30 flex items-center justify-center text-6xl font-bold text-white shadow-2xl">
                {parsedUserData?.name ? parsedUserData.name.charAt(0).toUpperCase() : "U"}
              </div>
              <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-white border-4 border-white shadow-lg flex items-center justify-center">
                <svg className="w-4 h-4 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              </div>
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Welcome back, {parsedUserData?.name || "Pet Lover"}!
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              Manage your account and discover personalized pet care experiences
            </p>
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
                  <h2 className="text-2xl font-bold text-slate-900 mb-6">Account Information</h2>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Full Name</label>
                      <div className="text-lg font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        {parsedUserData?.name || "Not set"}
                      </div>
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-slate-600">Email Address</label>
                      <div className="text-lg font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        {parsedUserData?.email || "Not set"}
                      </div>
                    </div>

                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium text-slate-600">Member Since</label>
                      <div className="text-lg font-semibold text-slate-900 bg-slate-50 rounded-lg px-4 py-3 border border-slate-200">
                        {formatDate(parsedUserData?.createdAt) || formatDate(new Date().toISOString())}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-8">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="text-2xl font-bold text-slate-900">Payment Methods</h2>
                    <button
                      onClick={() => setShowAddCardModal(true)}
                      className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all duration-200 transform hover:scale-105"
                    >
                      <BsCreditCard className="w-4 h-4 inline mr-2" />
                      Add Card
                    </button>
                  </div>

                  <CardList
                    key={cardsRefreshTrigger}
                    onAddCard={() => setShowAddCardModal(true)}
                  />
                </div>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-8">
              {/* Stats */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Stats</h3>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Profile Complete</p>
                          <p className="text-xs text-slate-600">85%</p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded-full bg-orange-100 flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-slate-900">Member Since</p>
                          <p className="text-xs text-slate-600">{formatDate(parsedUserData?.createdAt) || "Unknown"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow overflow-hidden">
                <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-slate-900 mb-4">Account Actions</h3>

                  <div className="space-y-3">
                    <Link
                      href="/transactions"
                      className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all duration-200 transform hover:scale-105"
                    >
                      <BsCreditCard className="w-4 h-4 mr-2" />
                      View Transactions
                    </Link>

                    {/* <form action="/api/auth/logout" method="post" className="w-full"> */}
                      <button
                        onClick={logout}
                        className="w-full flex items-center justify-center px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow hover:from-red-600 hover:to-red-700 transition-all duration-200 transform hover:scale-105"
                      >
                        <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
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

      {/* Add Card Modal */}
      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onCardAdded={handleCardAdded}
      />
    </div>
  );
}
