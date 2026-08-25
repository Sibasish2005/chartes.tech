import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import AppLayout from "@/components/layout/AppLayout";
import RecentPostsList, { PostItem } from "@/components/dashboard/RecentPostsList";
import {
  Layers,
  CheckCircle2,
  Clock,
  AlertCircle,
  Plus,
  ArrowUpRight,
  Share2,
} from "lucide-react";

export default async function AutomationPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/login");
  }

  // Fetch real counts & posts for the logged-in user
  const [totalCount, publishedCount, scheduledCount, failedCount, posts] =
    await Promise.all([
      prisma.post.count({ where: { userId: user.id } }),
      prisma.post.count({
        where: { userId: user.id, status: "PUBLISHED" },
      }),
      prisma.post.count({
        where: { userId: user.id, status: "SCHEDULED" },
      }),
      prisma.post.count({
        where: { userId: user.id, status: "FAILED" },
      }),
      prisma.post.findMany({
        where: { userId: user.id },
        include: { platform: true },
        orderBy: { createdAt: "desc" },
      }),
    ]);

  const formattedPosts: PostItem[] = posts.map((p) => ({
    id: p.id,
    caption: p.caption,
    imageUrl: p.imageUrl,
    status: p.status as PostItem["status"],
    scheduledAt: p.scheduledAt,
    createdAt: p.createdAt,
    platform: p.platform.map((pl) => ({
      id: pl.id,
      platform: pl.platform as PostItem["platform"][0]["platform"],
      status: pl.status as PostItem["platform"][0]["status"],
    })),
  }));

  const statCards = [
    {
      title: "Total Posts",
      value: totalCount,
      description: "All time automations",
      icon: Layers,
      accent: "text-neutral-700 bg-neutral-100",
    },
    {
      title: "Published",
      value: publishedCount,
      description: "Successfully dispatched",
      icon: CheckCircle2,
      accent: "text-emerald-700 bg-emerald-50",
    },
    {
      title: "Scheduled",
      value: scheduledCount,
      description: "In publishing queue",
      icon: Clock,
      accent: "text-amber-700 bg-amber-50",
    },
    {
      title: "Failed",
      value: failedCount,
      description: "Requires attention",
      icon: AlertCircle,
      accent: "text-rose-700 bg-rose-50",
    },
  ];

  return (
    <AppLayout userEmail={user.email} userName={user.name || undefined}>
      <div className="space-y-6">
        {/* Header Hero Banner */}
        <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Automation Dashboard
            </h1>
            <p className="text-neutral-500 text-xs lg:text-sm max-w-xl">
              Monitor, schedule, and orchestrate automated campaigns across LinkedIn and connected networks.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <Link
              href="/connected-accounts"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full border border-neutral-200 bg-white text-neutral-700 text-xs font-medium hover:bg-neutral-50 transition-all shadow-xs"
            >
              <Share2 className="w-3.5 h-3.5 text-neutral-500" />
              <span>Accounts</span>
            </Link>
            <Link
              href="/create-post"
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Post</span>
            </Link>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.title}
                className="bg-white rounded-2xl border border-[#EAE3D9] p-5 shadow-xs flex flex-col justify-between"
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs font-medium text-neutral-500">
                    {stat.title}
                  </p>
                  <div
                    className={`w-7 h-7 rounded-lg flex items-center justify-center ${stat.accent}`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div className="mt-3">
                  <span className="text-2xl lg:text-3xl font-bold text-neutral-900 tracking-tight">
                    {stat.value}
                  </span>
                  <p className="text-[11px] text-neutral-400 mt-0.5">
                    {stat.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Recent Posts Section with Top-3 Scroll and Delete Confirmation */}
        <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-7 shadow-xs space-y-4">
          <div className="flex items-center justify-between border-b border-[#EAE3D9]/60 pb-3.5">
            <div>
              <h2 className="text-base font-bold text-neutral-900">
                Recent Scheduled & Published Posts
              </h2>
              <p className="text-xs text-neutral-500 mt-0.5">
                Overview of recent distribution jobs and platform states
              </p>
            </div>
            <Link
              href="/create-post"
              className="text-xs font-medium text-neutral-600 hover:text-neutral-900 flex items-center gap-1 transition-colors"
            >
              <span>Compose</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <RecentPostsList initialPosts={formattedPosts} />
        </div>
      </div>
    </AppLayout>
  );
}
