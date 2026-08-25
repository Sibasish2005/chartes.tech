"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Plus_Jakarta_Sans } from "next/font/google";
import { motion, AnimatePresence } from "framer-motion";
import {
  LayoutDashboard,
  PenSquare,
  Share2,
  Calendar,
  FileText,
  Home,
  LogOut,
  Menu,
  X,
  Plus,
} from "lucide-react";

const fontSans = Plus_Jakarta_Sans({
  weight: ["400", "500", "600", "700"],
  subsets: ["latin"],
});

interface AppSidebarProps {
  userEmail?: string;
  userName?: string;
}

const navItems = [
  {
    label: "Dashboard",
    href: "/automation",
    icon: LayoutDashboard,
  },
  {
    label: "Create Post",
    href: "/create-post",
    icon: PenSquare,
  },
  {
    label: "Connected Accounts",
    href: "/connected-accounts",
    icon: Share2,
  },
  {
    label: "Privacy Policy",
    href: "/privacy",
    icon: FileText,
  },
  {
    label: "Landing Page",
    href: "/",
    icon: Home,
  },
];

export default function AppSidebar({ userEmail, userName }: AppSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const toggleMobile = () => setMobileOpen(!mobileOpen);

  async function handleLogout() {
    setLoggingOut(true);
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        window.location.href = "/login";
      }
    } catch (err) {
      console.error(err);
      setLoggingOut(false);
    }
  }

  const userInitial = (userName?.[0] || userEmail?.[0] || "U").toUpperCase();
  const displayName = userName || userEmail?.split("@")[0] || "User";

  return (
    <>
      {/* ========================================================= */}
      {/* MOBILE STICKY TOPBAR */}
      {/* ========================================================= */}
      <header
        className={`lg:hidden sticky top-0 z-40 w-full bg-[#FAF8F5]/90 backdrop-blur-md border-b border-[#EAE3D9] px-4 py-3 flex items-center justify-between ${fontSans.className}`}
      >
        <Link href="/" className="flex items-center gap-2">
          <img
            src="/logo.png"
            alt="Omnii Logo"
            className="h-9 w-auto object-contain"
          />
        </Link>

        <div className="flex items-center gap-2">
          <Link
            href="/create-post"
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-[#18181B] text-white text-xs font-medium rounded-full hover:bg-neutral-800 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Post</span>
          </Link>
          <button
            onClick={toggleMobile}
            className="p-2 text-neutral-600 hover:text-neutral-900 focus:outline-none rounded-xl hover:bg-black/5"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </header>

      {/* ========================================================= */}
      {/* MOBILE FULL-SCREEN DRAWER */}
      {/* ========================================================= */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className={`lg:hidden fixed inset-x-0 top-[57px] bottom-0 bg-[#FAF8F5] z-40 overflow-y-auto px-6 py-6 flex flex-col justify-between ${fontSans.className}`}
          >
            <div className="space-y-6">
              {/* User Profile Card */}
              {userEmail && (
                <div className="p-4 bg-white rounded-2xl border border-[#EAE3D9] flex items-center gap-3 shadow-xs">
                  <div className="w-10 h-10 rounded-full bg-[#18181B] text-white flex items-center justify-center font-semibold text-xs tracking-wide">
                    {userInitial}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm font-semibold text-neutral-900 truncate">
                      {displayName}
                    </p>
                    <p className="text-xs text-neutral-500 truncate">
                      {userEmail}
                    </p>
                  </div>
                </div>
              )}

              {/* Action Button */}
              <Link
                href="/create-post"
                onClick={() => setMobileOpen(false)}
                className="w-full flex items-center justify-center gap-2 py-3 bg-[#18181B] text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-xs"
              >
                <Plus className="w-4 h-4" />
                <span>Create New Post</span>
              </Link>

              {/* Navigation Links */}
              <nav className="space-y-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={`flex items-center gap-3.5 px-4 py-2.5 rounded-xl text-xs font-medium transition-all ${
                        isActive
                          ? "bg-[#18181B] text-white font-semibold"
                          : "text-neutral-600 hover:bg-black/5 hover:text-neutral-900"
                      }`}
                    >
                      <Icon
                        className={`w-4 h-4 ${
                          isActive ? "text-white" : "text-neutral-400"
                        }`}
                      />
                      <span>{item.label}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Logout Button */}
            <div className="pt-6 border-t border-[#EAE3D9]">
              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="w-full flex items-center justify-center gap-2 py-2.5 rounded-full border border-neutral-200 bg-white text-neutral-600 text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================= */}
      {/* DESKTOP FIXED SIDEBAR */}
      {/* ========================================================= */}
      <aside
        className={`hidden lg:flex w-64 h-screen sticky top-0 flex-col justify-between bg-[#FAF8F5] border-r border-[#EAE3D9] p-5 z-30 ${fontSans.className}`}
      >
        <div className="space-y-6">
          {/* Brand Logo */}
          <div className="px-2">
            <Link href="/" className="inline-block">
              <img
                src="/logo.png"
                alt="Omnii Logo"
                className="h-12 w-auto object-contain"
              />
            </Link>
          </div>

          {/* Quick Create CTA */}
          <div>
            <Link
              href="/create-post"
              className="w-full flex items-center justify-center gap-2 py-2.5 bg-[#18181B] text-white text-xs font-semibold rounded-full hover:bg-neutral-800 transition-all shadow-xs group"
            >
              <Plus className="w-3.5 h-3.5 transition-transform group-hover:rotate-90" />
              <span>Create Post</span>
            </Link>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1 pt-1">
            <p className="px-3 pb-1 text-[10px] font-semibold tracking-wider text-neutral-400 uppercase">
              Workspace
            </p>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-medium transition-all ${
                    isActive
                      ? "bg-[#18181B] text-white font-semibold shadow-xs"
                      : "text-neutral-600 hover:bg-black/5 hover:text-neutral-900"
                  }`}
                >
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-white" : "text-neutral-400"
                    }`}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Profile & Logout Footer */}
        <div className="space-y-2.5 pt-4 border-t border-[#EAE3D9]">
          {userEmail && (
            <div className="p-2.5 bg-white rounded-xl border border-[#EAE3D9] flex items-center gap-2.5 shadow-xs">
              <div className="w-8 h-8 rounded-full bg-[#18181B] text-white flex items-center justify-center font-bold text-[11px]">
                {userInitial}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-semibold text-neutral-900 truncate">
                  {displayName}
                </p>
                <p className="text-[10px] text-neutral-500 truncate">
                  {userEmail}
                </p>
              </div>
            </div>
          )}

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="w-full flex items-center justify-center gap-2 py-2 rounded-full border border-neutral-200 bg-white text-neutral-600 text-xs font-medium hover:bg-red-50 hover:text-red-600 hover:border-red-200 transition-all disabled:opacity-50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>{loggingOut ? "Signing out..." : "Sign Out"}</span>
          </button>
        </div>
      </aside>
    </>
  );
}
