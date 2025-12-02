"use client";

import { useRouter } from "next/navigation";
import React, { useState } from "react";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { signIn } from "next-auth/react";

type Mode = "login" | "signup";

export default function AuthForm({ mode = "login" }: { mode?: Mode }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (mode === "signup") {
        // Register new user
        const res = await fetch("/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password, name }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data?.error || "Registration failed");

        // Auto-login after successful registration
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push("/chat");
        router.refresh();
      } else {
        // Login existing user
        const result = await signIn("credentials", {
          email,
          password,
          redirect: false,
        });

        if (result?.error) {
          throw new Error(result.error);
        }

        router.push("/chat");
        router.refresh();
      }
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form
      onSubmit={onSubmit}
      className="max-w-md mx-auto bg-white shadow rounded-lg p-6 space-y-4 border border-gray-100"
    >
      <h1 className="text-2xl font-bold text-slate-900">
        {mode === "signup" ? "Create account" : "Welcome back"}
      </h1>
      <p className="text-sm text-slate-600">
        {mode === "signup"
          ? "Sign up with your email and a password."
          : "Log in to your account."}
      </p>
      {mode === "signup" && (
        <div>
          <label className="block text-sm font-medium text-slate-700">
            Name
          </label>
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
        <label className="block text-sm font-medium text-slate-700">
          Email
        </label>
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
        <label className="block text-sm font-medium text-slate-700">
          Password
        </label>
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-orange-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="••••••••"
            required
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <BsEyeSlash className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            ) : (
              <BsEye className="h-4 w-4 text-gray-400 hover:text-gray-600" />
            )}
          </button>
        </div>
      </div>
      {error && <div className="text-sm text-red-600">{error}</div>}
      <button
        type="submit"
        disabled={loading}
        className="w-full rounded-md bg-gradient-to-r from-[#B57DFF] to-[#ff8a1e] text-white py-2.5 font-medium shadow hover:opacity-95 disabled:opacity-60"
      >
        {loading
          ? mode === "signup"
            ? "Creating..."
            : "Logging in..."
          : mode === "signup"
          ? "Sign up"
          : "Log in"}
      </button>
    </form>
  );
}
