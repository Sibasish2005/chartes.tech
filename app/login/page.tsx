"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { signinSchema } from "@/lib/validations/auth";
import { Plus_Jakarta_Sans } from "next/font/google";
import { ArrowRight } from "lucide-react";
import { useAuthRedirect } from "@/lib/hooks";

const fontSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Auto-redirect if already logged in
  useAuthRedirect({ redirectToIfAuthenticated: "/automation" });

  async function handleSubmit(event: FormEvent<HTMLElement>) {
    event.preventDefault();
    setError("");

    const validationResult = signinSchema.safeParse({ email, password });
    if (!validationResult.success) {
      setError(validationResult.error.issues[0]?.message || "Invalid credentials");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.error || "Login failed");
        return;
      }

      window.location.href = "/automation";
    } catch {
      setError("Something went wrong");
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
              Welcome Back
            </h1>
            <p className="text-xs text-neutral-500">
              Sign in to manage your automated social distribution
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-medium text-neutral-700 block">
                Email Address
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
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
              <span>{loading ? "Signing in..." : "Sign In"}</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </form>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-[#EAE3D9] w-full" />
            <span className="bg-white px-2.5 text-[10px] font-semibold text-neutral-400 uppercase tracking-wider absolute">
              Or
            </span>
          </div>

          <a
            href="/api/auth/google"
            className="w-full py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-all shadow-xs flex items-center justify-center gap-2"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.66-5.17 3.66-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.36 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.04 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.36 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Continue with Google</span>
          </a>

          <p className="text-center text-xs text-neutral-500">
            Don't have an account?{" "}
            <Link
              href="/signup"
              className="font-semibold text-neutral-900 hover:underline"
            >
              Sign up
            </Link>
          </p>

          <p className="text-[11px] text-center text-neutral-400">
            <Link href="/terms" className="hover:text-neutral-700 underline">
              Terms of Service
            </Link>{" "}
            •{" "}
            <Link href="/privacy" className="hover:text-neutral-700 underline">
              Privacy Policy
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
