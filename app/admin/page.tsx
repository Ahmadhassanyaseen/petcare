"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  BsBoxSeam,
  BsClock,
  BsGrid,
  BsPeople,
  BsArrowRight,
  BsBoxArrowRight,
} from "react-icons/bs";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [stats, setStats] = useState({
    totalPlans: 0,
    totalPackages: 0,
    activePlans: 0,
    activePackages: 0,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "admin" && status === "authenticated") {
      router.push("/");
    }
  }, [status, session, router]);

  useEffect(() => {
    // Fetch stats
    const fetchStats = async () => {
      try {
        const [plansRes, packagesRes] = await Promise.all([
          fetch("/api/admin/plans"),
          fetch("/api/admin/packages"),
        ]);

        const plans = await plansRes.json();
        const packages = await packagesRes.json();

        setStats({
          totalPlans: plans.length,
          totalPackages: packages.length,
          activePlans: plans.filter((p: any) => p.isActive).length,
          activePackages: packages.filter((p: any) => p.isActive).length,
        });
      } catch (error) {
        console.error("Failed to fetch stats", error);
      }
    };

    if (session?.user?.role === "admin") {
      fetchStats();
    }
  }, [session]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  const quickActions = [
    {
      title: "Manage Plans",
      description: "Create and manage subscription plans",
      icon: BsGrid,
      href: "/admin/plans",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Manage Packages",
      description: "Create and manage minute packages",
      icon: BsBoxSeam,
      href: "/admin/packages",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ];

  const statsCards = [
    {
      label: "Total Plans",
      value: stats.totalPlans,
      icon: BsGrid,
      color: "text-purple-600",
      bgColor: "bg-purple-100",
    },
    {
      label: "Active Plans",
      value: stats.activePlans,
      icon: BsGrid,
      color: "text-green-600",
      bgColor: "bg-green-100",
    },
    {
      label: "Total Packages",
      value: stats.totalPackages,
      icon: BsClock,
      color: "text-orange-600",
      bgColor: "bg-orange-100",
    },
    {
      label: "Active Packages",
      value: stats.activePackages,
      icon: BsClock,
      color: "text-blue-600",
      bgColor: "bg-blue-100",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="text-gray-600 text-sm mt-1">
                Welcome back, {session.user?.name}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
              >
                <BsPeople className="w-4 h-4" />
                <span className="hidden sm:inline">View Site</span>
              </Link>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-orange-600 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
              >
                <BsBoxArrowRight className="w-4 h-4" />
                <span className="hidden sm:inline">Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {statsCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 sm:p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between mb-3">
                <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor}`}>
                  <stat.icon
                    className={`w-5 h-5 sm:w-6 sm:h-6 ${stat.color}`}
                  />
                </div>
              </div>
              <p className="text-xs sm:text-sm text-gray-600 mb-1">
                {stat.label}
              </p>
              <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                {stat.value}
              </p>
            </div>
          ))}
        </div>

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                href={action.href}
                className="group relative bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8 hover:shadow-xl transition-all duration-300 overflow-hidden"
              >
                {/* Gradient Background on Hover */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${action.color} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                ></div>

                <div className="relative">
                  <div
                    className={`inline-flex p-3 sm:p-4 rounded-xl ${action.bgColor} mb-4 group-hover:scale-110 transition-transform duration-300`}
                  >
                    <action.icon
                      className={`w-6 h-6 sm:w-8 sm:h-8 ${action.iconColor}`}
                    />
                  </div>

                  <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-purple-600 group-hover:to-orange-600 transition-all">
                    {action.title}
                  </h3>

                  <p className="text-sm sm:text-base text-gray-600 mb-4">
                    {action.description}
                  </p>

                  <div className="flex items-center text-sm font-medium text-purple-600 group-hover:text-orange-600 transition-colors">
                    <span>Get Started</span>
                    <BsArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Additional Info Section */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sm:p-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-gray-600">
                Manage your subscription plans and minute packages to offer the
                best value to your customers.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <Link
                href="/admin/plans"
                className="px-6 py-3 text-sm font-medium text-center text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors"
              >
                View Plans
              </Link>
              <Link
                href="/admin/packages"
                className="px-6 py-3 text-sm font-medium text-center text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors"
              >
                View Packages
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
