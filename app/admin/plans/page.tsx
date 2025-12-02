"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  BsArrowLeft,
  BsPlus,
  BsPencil,
  BsTrash,
  BsLightning,
  BsCheckCircle,
  BsXCircle,
} from "react-icons/bs";

interface Plan {
  _id: string;
  name: string;
  price: number;
  interval: "month" | "year";
  description: string;
  features: string[];
  minutes: number;
  isPopular: boolean;
  isActive: boolean;
}

export default function ManagePlans() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPlan, setCurrentPlan] = useState<Partial<Plan>>({
    name: "",
    price: 0,
    interval: "month",
    description: "",
    features: [],
    minutes: 0,
    isPopular: false,
    isActive: true,
  });
  const [featuresInput, setFeaturesInput] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "admin" && status === "authenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchPlans();
    }
  }, [status, session, router]);

  const fetchPlans = async () => {
    try {
      const res = await fetch("/api/admin/plans");
      const data = await res.json();
      setPlans(data);
    } catch (error) {
      console.error("Failed to fetch plans", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentPlan._id ? "PUT" : "POST";

    const features = featuresInput.split("\n").filter((f) => f.trim() !== "");

    try {
      const res = await fetch("/api/admin/plans", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...currentPlan, features }),
      });

      if (res.ok) {
        fetchPlans();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save plan", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this plan?")) return;
    try {
      const res = await fetch(`/api/admin/plans?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPlans();
    } catch (error) {
      console.error("Failed to delete plan", error);
    }
  };

  const handleEdit = (plan: Plan) => {
    setCurrentPlan(plan);
    setFeaturesInput(plan.features.join("\n"));
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setCurrentPlan({
      name: "",
      price: 0,
      interval: "month",
      description: "",
      features: [],
      minutes: 0,
      isPopular: false,
      isActive: true,
    });
    setFeaturesInput("");
    setIsEditing(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading plans...</p>
        </div>
      </div>
    );
  }

  if (session?.user?.role !== "admin") return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link
                href="/admin"
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <BsArrowLeft className="w-5 h-5 text-gray-600" />
              </Link>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                  Manage Plans
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {plans.length} plan{plans.length !== 1 ? "s" : ""} total
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 sticky top-24">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-bold text-gray-900">
                  {isEditing ? "Edit Plan" : "Create Plan"}
                </h2>
                {isEditing && (
                  <button
                    onClick={resetForm}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Clear
                  </button>
                )}
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Plan Name
                  </label>
                  <input
                    type="text"
                    value={currentPlan.name}
                    onChange={(e) =>
                      setCurrentPlan({ ...currentPlan, name: e.target.value })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                    placeholder="e.g., Premium"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price (cents)
                    </label>
                    <input
                      type="number"
                      value={currentPlan.price}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          price: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="999"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">$9.99 = 999</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Minutes
                    </label>
                    <input
                      type="number"
                      value={currentPlan.minutes}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          minutes: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                      placeholder="60"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Interval
                  </label>
                  <select
                    value={currentPlan.interval}
                    onChange={(e) =>
                      setCurrentPlan({
                        ...currentPlan,
                        interval: e.target.value as "month" | "year",
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  >
                    <option value="month">Monthly</option>
                    <option value="year">Yearly</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description (HTML supported)
                  </label>
                  <textarea
                    value={currentPlan.description}
                    onChange={(e) =>
                      setCurrentPlan({
                        ...currentPlan,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                    rows={4}
                    placeholder="<p>Brief description with <strong>HTML</strong> support</p>"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    You can use HTML tags like &lt;strong&gt;, &lt;em&gt;,
                    &lt;br&gt;, etc.
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Features (one per line, HTML supported)
                  </label>
                  <textarea
                    value={featuresInput}
                    onChange={(e) => setFeaturesInput(e.target.value)}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent resize-none font-mono text-sm"
                    rows={6}
                    placeholder="<strong>Unlimited</strong> access&#10;24/7 support&#10;<em>Priority</em> features"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Each line is a feature. HTML tags are supported.
                  </p>
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPlan.isPopular}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          isPopular: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Popular
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPlan.isActive}
                      onChange={(e) =>
                        setCurrentPlan({
                          ...currentPlan,
                          isActive: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Active
                    </span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-purple-600 to-orange-600 text-white py-3 rounded-lg font-semibold hover:shadow-lg transition-all flex items-center justify-center gap-2"
                  >
                    <BsPlus className="w-5 h-5" />
                    {isEditing ? "Update Plan" : "Create Plan"}
                  </button>
                  {isEditing && (
                    <button
                      type="button"
                      onClick={resetForm}
                      className="px-6 bg-gray-200 text-gray-800 py-3 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>
          </div>

          {/* List */}
          <div className="lg:col-span-2 space-y-4">
            {plans.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BsPlus className="w-8 h-8 text-purple-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No plans yet
                </h3>
                <p className="text-gray-600">
                  Create your first subscription plan to get started.
                </p>
              </div>
            ) : (
              plans.map((plan) => (
                <div
                  key={plan._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <h3 className="text-xl font-bold text-gray-900">
                          {plan.name}
                        </h3>
                        {plan.isPopular && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <BsLightning className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                        {plan.isActive ? (
                          <span className="inline-flex items-center gap-1 bg-green-100 text-green-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <BsCheckCircle className="w-3 h-3" />
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 bg-red-100 text-red-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <BsXCircle className="w-3 h-3" />
                            Inactive
                          </span>
                        )}
                      </div>

                      <div className="flex items-baseline gap-2 mb-3">
                        <p className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-orange-600 bg-clip-text text-transparent">
                          ${(plan.price / 100).toFixed(2)}
                        </p>
                        <span className="text-gray-500 text-sm">
                          / {plan.interval}
                        </span>
                      </div>

                      <p className="text-sm font-medium text-purple-600 mb-3">
                        Includes {plan.minutes} minutes
                      </p>

                      {plan.description && (
                        <div
                          className="text-gray-600 mb-4 prose prose-sm max-w-none"
                          dangerouslySetInnerHTML={{ __html: plan.description }}
                        />
                      )}

                      {plan.features.length > 0 && (
                        <div className="space-y-1">
                          {plan.features.slice(0, 3).map((feature, i) => (
                            <div
                              key={i}
                              className="flex items-start gap-2 text-sm text-gray-600"
                            >
                              <BsCheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                              <span
                                className="prose prose-sm max-w-none"
                                dangerouslySetInnerHTML={{ __html: feature }}
                              />
                            </div>
                          ))}
                          {plan.features.length > 3 && (
                            <p className="text-sm text-gray-500 pl-6">
                              +{plan.features.length - 3} more features
                            </p>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <button
                        onClick={() => handleEdit(plan)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-purple-600 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors font-medium"
                      >
                        <BsPencil className="w-4 h-4" />
                        <span className="sm:hidden">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(plan._id)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors font-medium"
                      >
                        <BsTrash className="w-4 h-4" />
                        <span className="sm:hidden">Delete</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
