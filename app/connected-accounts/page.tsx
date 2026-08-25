import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import {
  CheckCircle2,
  ExternalLink,
  Plus,
  Briefcase,
  ShieldCheck,
  Camera,
  Users,
} from "lucide-react";

export default async function ConnectedAccountsPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  const accounts = await prisma.account.findMany({
    where: { userId: user.id },
  });

  const connectedProviders = new Set(
    accounts.map((a: { provider: string }) => a.provider.toLowerCase())
  );

  const platforms = [
    {
      id: "linkedin",
      name: "LinkedIn",
      tagline: "Professional Network & Publishing",
      description:
        "Direct REST API integration to syndicate company updates and thought-leadership posts.",
      connected: connectedProviders.has("linkedin"),
      connectUrl: "/api/social/linkedin",
      icon: Briefcase,
      badge: "Active",
      badgeColor: "bg-neutral-100 text-neutral-700 border-neutral-200",
    },
    {
      id: "google",
      name: "Google",
      tagline: "Single Sign-On & Identity",
      description:
        "OpenID Connect authentication account for session verification and dashboard login.",
      connected: connectedProviders.has("google"),
      connectUrl: "/api/auth/google",
      icon: ShieldCheck,
      badge: "Account Auth",
      badgeColor: "bg-neutral-100 text-neutral-700 border-neutral-200",
    },
    {
      id: "instagram",
      name: "Instagram",
      tagline: "Feed & Reels Automation",
      description:
        "Automate high-converting carousels and visual updates directly to your Professional account.",
      connected: connectedProviders.has("instagram"),
      connectUrl: "#",
      icon: Camera,
      badge: "Coming Soon",
      badgeColor: "bg-neutral-100 text-neutral-400 border-neutral-200",
    },
    {
      id: "facebook",
      name: "Facebook Pages",
      tagline: "Brand Pages & Communities",
      description:
        "Publish scheduled announcements, promotions, and media directly to your Facebook Pages.",
      connected: connectedProviders.has("facebook"),
      connectUrl: "#",
      icon: Users,
      badge: "Coming Soon",
      badgeColor: "bg-neutral-100 text-neutral-400 border-neutral-200",
    },
  ];

  return (
    <AppLayout userEmail={user.email} userName={user.name || undefined}>
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Connected Accounts
            </h1>
            <p className="text-neutral-500 text-xs lg:text-sm max-w-xl">
              Manage your authorized social networks and single sign-on connections for publishing.
            </p>
          </div>

          <Link
            href="/create-post"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs self-start md:self-auto"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Compose Post</span>
          </Link>
        </div>

        {/* Platforms Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">

          {platforms.map((platform) => {
            const IconComponent = platform.icon;
            return (
              <div
                key={platform.id}
                className="bg-white rounded-2xl border border-[#EAE3D9] p-5 lg:p-6 shadow-xs flex flex-col justify-between space-y-5"
              >
                <div className="space-y-3">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {/* Monochrome Lucide Icon Container */}
                      <div className="w-10 h-10 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] flex items-center justify-center text-neutral-800 shadow-xs">
                        <IconComponent className="w-5 h-5 stroke-[1.75]" />
                      </div>
                      <div>
                        <h2 className="text-sm font-bold text-neutral-900">
                          {platform.name}
                        </h2>
                        <p className="text-[11px] text-neutral-500 font-medium">
                          {platform.tagline}
                        </p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-medium border ${platform.badgeColor}`}
                    >
                      {platform.badge}
                    </span>
                  </div>

                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {platform.description}
                  </p>
                </div>

                <div className="pt-3.5 border-t border-[#EAE3D9]/60 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span
                      className={`w-2 h-2 rounded-full ${
                        platform.connected
                          ? "bg-neutral-900"
                          : "bg-neutral-300"
                      }`}
                    />
                    <span className="text-[11px] font-medium text-neutral-600">
                      {platform.connected ? "Connected" : "Not connected"}
                    </span>
                  </div>

                  {platform.connected ? (
                    <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#FAF8F5] text-neutral-800 text-xs font-medium border border-[#EAE3D9]">
                      <CheckCircle2 className="w-3.5 h-3.5 text-neutral-700" />
                      <span>Connected</span>
                    </div>
                  ) : platform.connectUrl === "#" ? (
                    <button
                      disabled
                      className="px-3 py-1 rounded-full bg-neutral-100 text-neutral-400 text-xs font-medium cursor-not-allowed"
                    >
                      Coming Soon
                    </button>
                  ) : (
                    <a
                      href={platform.connectUrl}
                      className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs group"
                    >
                      <span>Connect Account</span>
                      <ExternalLink className="w-3 h-3 transition-transform group-hover:translate-x-0.5" />
                    </a>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}
