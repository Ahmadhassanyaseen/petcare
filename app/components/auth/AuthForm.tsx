"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";

type Mode = "login" | "signup";

export default function AuthForm({ mode = "login" }: { mode?: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const endpoint = mode === "signup" ? "/api/auth/register" : "/api/auth/login";
      const payload: any = { email, password };
      if (mode === "signup" && name) payload.name = name;
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Request failed");
      localStorage.setItem("user_data", JSON.stringify(data));
      router.push("/profile");
      router.refresh();
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="max-w-md mx-auto bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100">
      <h1 className="text-2xl font-bold text-slate-900">{mode === "signup" ? "Create account" : "Welcome back"}</h1>
      <p className="text-sm text-slate-600">{mode === "signup" ? "Sign up with your email and a password." : "Log in to your account."}</p>
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-slate-700">Name</label>
          <input
            type="text"
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
          />
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700">Email</label>
        <input
          type="email"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700">Password</label>
        <input
          type="password"
          className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-orange-400"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-gradient-to-r from-[#ff6a3d] to-[#ff8a1e] text-white py-2.5 font-medium shadow hover:opacity-95 disabled:opacity-60"
      >
        {loading ? (mode === "signup" ? "Creating..." : "Logging in...") : mode === "signup" ? "Sign up" : "Log in"}
      </button>
    </form>
  );
}
