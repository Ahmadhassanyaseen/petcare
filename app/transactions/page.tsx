import { getAuthFromCookies } from "@/lib/auth";
import { redirect } from "next/navigation";
import { connectToDatabase } from "@/lib/mongoose";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import Link from "next/link";
import { BsArrowLeft, BsCreditCard, BsCalendar, BsCheckCircle, BsXCircle, BsClock, BsPlus } from "react-icons/bs";
import MinutesSection from "./MinutesSection";

interface Transaction {
  _id: string;
  plan: string;
  amount: number;
  currency: string;
  status: "pending" | "completed" | "failed";
  cardLast4?: string;
  cardBrand?: string;
  createdAt: string;
  stripePaymentIntentId: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case "completed":
      return <BsCheckCircle className="w-5 h-5 text-green-600" />;
    case "failed":
      return <BsXCircle className="w-5 h-5 text-red-600" />;
    default:
      return <BsClock className="w-5 h-5 text-yellow-600" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "completed":
      return "bg-green-100 text-green-800";
    case "failed":
      return "bg-red-100 text-red-800";
    default:
      return "bg-yellow-100 text-yellow-800";
  }
};

const formatAmount = (amount: number, currency: string) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100); // Convert from cents to dollars
};

export default async function TransactionsPage() {
  const session = await getAuthFromCookies();
  if (!session) {
    redirect("/login");
  }

  await connectToDatabase();
  const transactions = await Transaction.find({ userId: session.sub })
    .sort({ createdAt: -1 })
    .select("plan amount currency status cardLast4 cardBrand createdAt stripePaymentIntentId");

  const user = await User.findById(session.sub).select("total_time");
  const userMinutes = user?.total_time || 0;

  const transactionData = transactions.map((t: any) => ({
    _id: t._id.toString(),
    plan: t.plan,
    amount: t.amount,
    currency: t.currency,
    status: t.status,
    cardLast4: t.cardLast4,
    cardBrand: t.cardBrand,
    createdAt: t.createdAt.toISOString(),
    stripePaymentIntentId: t.stripePaymentIntentId,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-orange-50">
      {/* Header */}
      <section className="relative overflow-hidden bg-gradient-to-r from-[#ff4d2d] to-[#ff7a18]">
        <div className="absolute inset-0 bg-black/20" />

        {/* Back Button */}
        <div className="absolute top-6 left-6 z-50">
          <Link
            href="/profile"
            className="group flex items-center space-x-3 bg-white/10 backdrop-blur-md border border-white/20 rounded-xl px-4 py-3 text-white hover:bg-white/20 transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="p-2 rounded-lg bg-white/20 group-hover:bg-white/30 transition-all duration-300 group-hover:rotate-12">
              <BsArrowLeft className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold tracking-wide">Back to Profile</span>
          </Link>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-24">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white mb-4">
              Transaction History
            </h1>
            <p className="text-xl text-white/90 max-w-2xl mx-auto">
              View all your payment transactions and subscription history
            </p>
          </div>
        </div>

        <div className="absolute -bottom-8 left-0 right-0 h-16 bg-gradient-to-b from-transparent to-white" />
      </section>

      {/* Main Content */}
      <section className="relative -mt-16 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Minutes Purchase Section */}
          <MinutesSection userId={session.sub} currentMinutes={userMinutes} />
          {transactionData.length === 0 ? (
            <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
              <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
              <div className="p-12 text-center">
                <div className="w-16 h-16 mx-auto mb-4 bg-orange-100 rounded-full flex items-center justify-center">
                  <BsCreditCard className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No Transactions Yet</h3>
                <p className="text-slate-600 mb-6">You haven't made any payments yet. Start by subscribing to one of our plans!</p>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center px-6 py-3 text-white font-semibold bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] rounded-lg shadow hover:from-[#ff5a2b] hover:to-[#ff7a18] transition-all hover:scale-105"
                >
                  Browse Plans
                </Link>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {transactionData.map((transaction: Transaction) => (
                <div
                  key={transaction._id}
                  className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden"
                >
                  <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
                  <div className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center">
                          <BsCreditCard className="w-6 h-6 text-orange-600" />
                        </div>
                        <div>
                          <h3 className="text-lg font-semibold text-slate-900 capitalize">
                            {transaction.plan} Plan
                          </h3>
                          <p className="text-sm text-slate-600">
                            {new Date(transaction.createdAt).toLocaleDateString("en-US", {
                              year: "numeric",
                              month: "long",
                              day: "numeric",
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="text-2xl font-bold text-slate-900">
                          {formatAmount(transaction.amount, transaction.currency)}
                        </div>
                        <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(transaction.status)}`}>
                          {getStatusIcon(transaction.status)}
                          <span className="ml-2 capitalize">{transaction.status}</span>
                        </div>
                      </div>
                    </div>

                    {(transaction.cardLast4 || transaction.cardBrand) && (
                      <div className="mt-4 pt-4 border-t border-slate-200">
                        <div className="flex items-center justify-between text-sm text-slate-600">
                          <span>
                            {transaction.cardBrand && (
                              <span className="capitalize mr-2">{transaction.cardBrand}</span>
                            )}
                            {transaction.cardLast4 && <span>•••• {transaction.cardLast4}</span>}
                          </span>
                          <span className="font-mono text-xs">
                            ID: {transaction.stripePaymentIntentId.slice(-8)}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
