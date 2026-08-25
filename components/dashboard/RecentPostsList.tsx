"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Trash2,
  Calendar,
  Plus,
  Loader2,
  FileText,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatDate(dateInput: Date | string): string {
  const d = new Date(dateInput);
  if (isNaN(d.getTime())) return "";
  return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

import { useDeletePost } from "@/lib/hooks";

export interface PostItem {
  id: string;
  caption: string | null;
  imageUrl: string | null;
  status: "DRAFT" | "SCHEDULED" | "PUBLISHED" | "FAILED";
  scheduledAt: Date | string | null;
  createdAt: Date | string;
  platform: {
    id: string;
    platform: "INSTAGRAM" | "FACEBOOK" | "LINKEDIN";
    status: "PENDING" | "PUBLISHED" | "FAILED";
  }[];
}

interface RecentPostsListProps {
  initialPosts: PostItem[];
}

export default function RecentPostsList({ initialPosts }: RecentPostsListProps) {
  const [posts, setPosts] = useState<PostItem[]>(initialPosts);
  const {
    postToDelete,
    deleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteConfirm,
  } = useDeletePost(posts, setPosts);

  if (posts.length === 0) {
    return (
      <div className="py-10 px-4 text-center rounded-xl border border-dashed border-[#EAE3D9] bg-[#FAF8F5]/60 space-y-3">
        <div className="w-10 h-10 rounded-full bg-neutral-100 mx-auto flex items-center justify-center text-neutral-400">
          <Calendar className="w-5 h-5" />
        </div>
        <div className="max-w-md mx-auto space-y-0.5">
          <h3 className="text-sm font-semibold text-neutral-800">
            No automated posts found
          </h3>
          <p className="text-xs text-neutral-500">
            Create and schedule your first multi-platform social post.
          </p>
        </div>
        <div className="pt-1">
          <Link
            href="/create-post"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#18181B] text-white text-xs font-medium rounded-full hover:bg-neutral-800 transition-all shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create First Post</span>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <>
      {/* Scrollable Container with max height showing top 3 items */}
      <div className="max-h-[235px] overflow-y-auto pr-1.5 space-y-1 divide-y divide-[#EAE3D9]/60 scrollbar-thin scrollbar-thumb-neutral-200 hover:scrollbar-thumb-neutral-300">
        {posts.map((post) => (
          <div
            key={post.id}
            className="py-3 px-1.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-[#FAF8F5]/80 rounded-xl transition-colors group"
          >
            <div className="flex items-start gap-3 min-w-0">
              {post.imageUrl ? (
                <img
                  src={post.imageUrl}
                  alt="Post media"
                  className="w-11 h-11 rounded-lg object-cover border border-[#EAE3D9] shrink-0 bg-neutral-100"
                />
              ) : (
                <div className="w-11 h-11 rounded-lg border border-[#EAE3D9] bg-[#FAF8F5] flex items-center justify-center text-neutral-400 shrink-0">
                  <FileText className="w-5 h-5" />
                </div>
              )}

              <div className="min-w-0 space-y-0.5">
                <p className="text-xs font-bold text-neutral-900 line-clamp-1">
                  {post.caption || "No caption provided"}
                </p>
                <div className="flex flex-wrap items-center gap-2 text-[11px] text-neutral-500">
                  <span suppressHydrationWarning>
                    {formatDate(post.createdAt)}
                  </span>
                  <span>•</span>
                  <div className="flex items-center gap-1">
                    {post.platform.map((p) => (
                      <span
                        key={p.id}
                        className="px-1.5 py-0.5 rounded-md text-[10px] font-medium bg-neutral-100 text-neutral-600 uppercase"
                      >
                        {p.platform}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2.5 self-end sm:self-auto shrink-0">
              <span
                className={`px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide ${
                  post.status === "PUBLISHED"
                    ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                    : post.status === "SCHEDULED"
                    ? "bg-amber-50 text-amber-700 border border-amber-200"
                    : post.status === "FAILED"
                    ? "bg-rose-50 text-rose-700 border border-rose-200"
                    : "bg-neutral-100 text-neutral-600"
                }`}
              >
                {post.status}
              </span>

              {/* Delete Button with Confirmation Pop-up */}
              <button
                type="button"
                onClick={() => openDeleteDialog(post)}
                className="p-1.5 rounded-lg text-neutral-400 hover:text-rose-600 hover:bg-rose-50 transition-all"
                title="Delete Post"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Shadcn Dialog */}
      <Dialog
        open={!!postToDelete}
        onOpenChange={(open) => {
          if (!open) closeDeleteDialog();
        }}
      >
        <DialogContent className="bg-white border border-[#EAE3D9] shadow-lg rounded-2xl p-6 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-base font-bold text-neutral-900">
              Are you sure you want to delete this post?
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-500 leading-relaxed pt-1">
              This action cannot be undone. This post will be permanently deleted from your dashboard history and publishing queue.
            </DialogDescription>
          </DialogHeader>

          {postToDelete && (
            <div className="my-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3D9] flex items-center gap-3">
              {postToDelete.imageUrl ? (
                <img
                  src={postToDelete.imageUrl}
                  alt="Post preview"
                  className="w-10 h-10 rounded-lg object-cover border border-[#EAE3D9] shrink-0"
                />
              ) : (
                <div className="w-10 h-10 rounded-lg border border-[#EAE3D9] bg-white flex items-center justify-center text-neutral-400 shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
              )}
              <p className="text-xs text-neutral-800 line-clamp-1 font-medium">
                {postToDelete.caption || "No caption provided"}
              </p>
            </div>
          )}

          <DialogFooter className="flex items-center justify-end gap-2 pt-2">
            <Button
              type="button"
              variant="outline"
              disabled={deleting}
              onClick={closeDeleteDialog}
              className="px-4 py-2 rounded-full border border-[#EAE3D9] text-xs font-medium text-neutral-700 hover:bg-[#FAF8F5]"
            >
              Cancel
            </Button>

            <Button
              type="button"
              disabled={deleting}
              onClick={handleDeleteConfirm}
              className="px-4 py-2 rounded-full bg-rose-600 text-white text-xs font-medium hover:bg-rose-700 transition-all shadow-xs flex items-center gap-1.5"
            >
              {deleting ? (
                <>
                  <Loader2 className="w-3 h-3 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <span>Delete Post</span>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
