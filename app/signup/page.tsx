"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signupSchema } from "@/lib/validations/auth";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { useAuthRedirect } from "@/lib/hooks";

const fontSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useAuthRedirect({ redirectToIfAuthenticated: "/automation" });

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    const validationResult = signupSchema.safeParse({ name, email, password });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message || "Invalid input");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          password,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to sign up");
      }
      window.location.href = "/login";
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      className={`min-h-screen bg-[#F8F6F2] flex items-center justify-center p-4 sm:p-6 ${fontSans.className}`}
    >
      <div className="w-full max-w-sm space-y-5">
        {/* Brand Logo */}
        <div className="text-center">
          <Link href="/" className="inline-block">
            <img
              src="/logo.png"
              alt="Omnii Logo"
              className="h-12 w-auto object-contain mx-auto"
            />
          </Link>
        </div>

        {/* Card Container */}
        <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 sm:p-7 shadow-xs space-y-5">
          <div className="space-y-1 text-center">
            <h1 className="text-xl font-bold tracking-tight text-neutral-900">
              Create an Account
            </h1>
            <p className="text-xs text-neutral-500">
              Start orchestrating automated social publishing
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 block">
                Full Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Alex Morgan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 block">
                Work Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="alex@company.com"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 block">
                Password
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Minimum 8 characters"
                className="w-full px-3.5 py-2.5 rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] text-xs text-neutral-900 focus:bg-white focus:outline-none focus:ring-1 focus:ring-black"
              />
            </div>

            {error && (
              <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs flex items-center justify-center gap-1.5 disabled:opacity-50 mt-2"
            >
              <span>{loading ? "Creating account..." : "Create Account"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <p className="text-center text-xs text-neutral-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="font-semibold text-neutral-900 hover:underline"
            >
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
