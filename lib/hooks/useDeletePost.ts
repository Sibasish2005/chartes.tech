"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { PostItem } from "@/components/dashboard/RecentPostsList";

export function useDeletePost(
  posts: PostItem[],
  setPosts: React.Dispatch<React.SetStateAction<PostItem[]>>
) {
  const router = useRouter();
  const [postToDelete, setPostToDelete] = useState<PostItem | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function handleDeleteConfirm() {
    if (!postToDelete) return;

    setDeleting(true);
    try {
      const response = await fetch(`/api/posts/${postToDelete.id}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to delete post");
      }

      // Optimistically remove from state
      setPosts((prev) => prev.filter((p) => p.id !== postToDelete.id));
      const deletedCaption = postToDelete.caption;
      setPostToDelete(null);
      router.refresh();

      toast.success("Post Deleted", {
        description: deletedCaption
          ? `"${deletedCaption.slice(0, 40)}..." was removed from your history.`
          : "The post was permanently removed.",
      });
    } catch (error) {
      console.error("Delete post error:", error);
      toast.error("Failed to delete post", {
        description: "Please check your network connection and try again.",
      });
    } finally {
      setDeleting(false);
    }
  }

  function openDeleteDialog(post: PostItem) {
    setPostToDelete(post);
  }

  function closeDeleteDialog() {
    if (!deleting) {
      setPostToDelete(null);
    }
  }

  return {
    postToDelete,
    deleting,
    openDeleteDialog,
    closeDeleteDialog,
    handleDeleteConfirm,
  };
}
