"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

interface User {
  _id: string;
  email: string;
  name?: string;
  createdAt: Date;
}

interface ProfileFormProps {
  user: User;
}

export default function ProfileForm({ user }: ProfileFormProps) {
  const [name, setName] = useState(user.name || "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.error || "Failed to update profile");
      }

      setMessage({ type: "success", text: "Profile updated successfully!" });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: "error", text: err.message || "Something went wrong" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative rounded-2xl border border-white/30 bg-white/10 backdrop-blur-xl shadow-[0_10px_40px_rgba(0,0,0,0.08)] overflow-hidden">
      <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-orange-400/40 via-orange-600/70 to-orange-400/40" />
      <div className="p-8">
        <h2 className="text-2xl font-bold text-slate-900 mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Full Name</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-400 focus:border-transparent transition-all duration-200"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-600">Email Address</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="w-full rounded-lg border border-slate-200 bg-slate-50 px-4 py-3 text-slate-500 cursor-not-allowed"
            />
            <p className="text-xs text-slate-500">Email cannot be changed</p>
          </div>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                message.type === "success"
                  ? "bg-green-50 border border-green-200 text-green-800"
                  : "bg-red-50 border border-red-200 text-red-800"
              }`}
            >
              {message.text}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-[#B57DFF] to-[#ff8a1e] rounded-lg shadow hover:from-[#ff5a2d] hover:to-[#ff7a0e] transition-all duration-200 transform hover:scale-105 disabled:opacity-60 disabled:transform-none"
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  Updating...
                </>
              ) : (
                <>
                  <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Update Profile
                </>
              )}
            </button>

            <button
              type="button"
              onClick={() => setName(user.name || "")}
              className="px-6 py-3 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg shadow hover:bg-slate-50 transition-all duration-200"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
