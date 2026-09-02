import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/layout/AppLayout";
import Link from "next/link";
import { Plus } from "lucide-react";
import ConnectedAccountsGrid, {
  PlatformConfig,
} from "@/components/accounts/ConnectedAccountsGrid";

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

  const platforms: PlatformConfig[] = [
    {
      id: "linkedin",
      name: "LinkedIn",
      tagline: "Professional Network & Publishing",
      description:
        "Direct REST API integration to syndicate company updates and thought-leadership posts.",
      connected: connectedProviders.has("linkedin"),
      connectUrl: "/api/social/linkedin",
      iconName: "linkedin",
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
      iconName: "google",
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
      connectUrl: "/api/social/facebook",
      iconName: "instagram",
      badge: connectedProviders.has("instagram") ? "Active" : "Ready",
      badgeColor: connectedProviders.has("instagram")
        ? "bg-neutral-100 text-neutral-700 border-neutral-200"
        : "bg-neutral-100 text-neutral-500 border-neutral-200",
    },
    {
      id: "facebook",
      name: "Facebook Pages",
      tagline: "Brand Pages & Communities",
      description:
        "Publish scheduled announcements, promotions, and media directly to your Facebook Pages.",
      connected: connectedProviders.has("facebook"),
      connectUrl: "/api/social/facebook",
      iconName: "facebook",
      badge: connectedProviders.has("facebook") ? "Active" : "Ready",
      badgeColor: connectedProviders.has("facebook")
        ? "bg-neutral-100 text-neutral-700 border-neutral-200"
        : "bg-neutral-100 text-neutral-500 border-neutral-200",
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

        {/* Interactive Platforms Grid with Disconnect support */}
        <ConnectedAccountsGrid initialPlatforms={platforms} />
      </div>
    </AppLayout>
  );
}
