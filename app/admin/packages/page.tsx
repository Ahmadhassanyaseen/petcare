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
  BsClock,
} from "react-icons/bs";

interface MinutePackage {
  _id: string;
  minutes: number;
  price: number;
  description: string;
  isPopular: boolean;
  isActive: boolean;
}

export default function ManagePackages() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [packages, setPackages] = useState<MinutePackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [currentPackage, setCurrentPackage] = useState<Partial<MinutePackage>>({
    minutes: 0,
    price: 0,
    description: "",
    isPopular: false,
    isActive: true,
  });

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
    } else if (session?.user?.role !== "admin" && status === "authenticated") {
      router.push("/");
    } else if (status === "authenticated") {
      fetchPackages();
    }
  }, [status, session, router]);

  const fetchPackages = async () => {
    try {
      const res = await fetch("/api/admin/packages");
      const data = await res.json();
      setPackages(data);
    } catch (error) {
      console.error("Failed to fetch packages", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = currentPackage._id ? "PUT" : "POST";

    try {
      const res = await fetch("/api/admin/packages", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(currentPackage),
      });

      if (res.ok) {
        fetchPackages();
        resetForm();
      }
    } catch (error) {
      console.error("Failed to save package", error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    try {
      const res = await fetch(`/api/admin/packages?id=${id}`, {
        method: "DELETE",
      });
      if (res.ok) fetchPackages();
    } catch (error) {
      console.error("Failed to delete package", error);
    }
  };

  const handleEdit = (pkg: MinutePackage) => {
    setCurrentPackage(pkg);
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setCurrentPackage({
      minutes: 0,
      price: 0,
      description: "",
      isPopular: false,
      isActive: true,
    });
    setIsEditing(false);
  };

  if (status === "loading" || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-orange-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading packages...</p>
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
                  Manage Packages
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  {packages.length} package{packages.length !== 1 ? "s" : ""}{" "}
                  total
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
                  {isEditing ? "Edit Package" : "Create Package"}
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
                    Minutes
                  </label>
                  <input
                    type="number"
                    value={currentPackage.minutes}
                    onChange={(e) =>
                      setCurrentPackage({
                        ...currentPackage,
                        minutes: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
                    placeholder="e.g., 60"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price (cents)
                  </label>
                  <input
                    type="number"
                    value={currentPackage.price}
                    onChange={(e) =>
                      setCurrentPackage({
                        ...currentPackage,
                        price: parseInt(e.target.value) || 0,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="999"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    $9.99 = 999 cents
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={currentPackage.description}
                    onChange={(e) =>
                      setCurrentPackage({
                        ...currentPackage,
                        description: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent resize-none"
                    rows={3}
                    placeholder="Brief description of the package"
                  />
                </div>

                <div className="flex items-center gap-6 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPackage.isPopular}
                      onChange={(e) =>
                        setCurrentPackage({
                          ...currentPackage,
                          isPopular: e.target.checked,
                        })
                      }
                      className="w-4 h-4 text-orange-600 border-gray-300 rounded focus:ring-orange-500"
                    />
                    <span className="text-sm font-medium text-gray-700">
                      Popular
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={currentPackage.isActive}
                      onChange={(e) =>
                        setCurrentPackage({
                          ...currentPackage,
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
                    {isEditing ? "Update Package" : "Create Package"}
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
            {packages.length === 0 ? (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center">
                <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <BsClock className="w-8 h-8 text-orange-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No packages yet
                </h3>
                <p className="text-gray-600">
                  Create your first minute package to get started.
                </p>
              </div>
            ) : (
              packages.map((pkg) => (
                <div
                  key={pkg._id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3 flex-wrap">
                        <div className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-100 to-orange-100 px-3 py-1.5 rounded-lg">
                          <BsClock className="w-5 h-5 text-orange-600" />
                          <h3 className="text-xl font-bold text-gray-900">
                            {pkg.minutes} Minutes
                          </h3>
                        </div>
                        {pkg.isPopular && (
                          <span className="inline-flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-semibold px-2.5 py-1 rounded-full">
                            <BsLightning className="w-3 h-3" />
                            Popular
                          </span>
                        )}
                        {pkg.isActive ? (
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
                          ${(pkg.price / 100).toFixed(2)}
                        </p>
                      </div>

                      {pkg.description && (
                        <p className="text-gray-600">{pkg.description}</p>
                      )}
                    </div>

                    <div className="flex sm:flex-col gap-2">
                      <button
                        onClick={() => handleEdit(pkg)}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-4 py-2 text-orange-600 bg-orange-50 rounded-lg hover:bg-orange-100 transition-colors font-medium"
                      >
                        <BsPencil className="w-4 h-4" />
                        <span className="sm:hidden">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(pkg._id)}
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
