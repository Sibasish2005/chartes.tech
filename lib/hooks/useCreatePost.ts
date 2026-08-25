"use client";

import { useState } from "react";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import { clearDraft } from "@/lib/features/postDraft/postDraftSlice";
import {
  setErrorMessage,
  resetComposerUi,
} from "@/lib/features/composerUi/composerUiSlice";
import { createPostSchema } from "@/lib/validations/post";

import { toast } from "sonner";

export function useCreatePost() {
  const dispatch = useAppDispatch();
  const { imageUrl, caption, platforms } = useAppSelector(
    (state) => state.postDraft
  );
  const { uploadStatus, errorMessage } = useAppSelector(
    (state) => state.composerUi
  );

  const [creating, setCreating] = useState(false);
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleDate, setScheduleDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split("T")[0]
  );
  const [scheduleTime, setScheduleTime] = useState("10:00");

  async function submitPost(scheduledAtISO: string | null) {
    dispatch(setErrorMessage(""));

    const validationResult = createPostSchema.safeParse({
      imageUrl,
      caption,
      platforms,
      scheduledAt: scheduledAtISO,
    });

    if (!validationResult.success) {
      const message =
        validationResult.error.issues[0]?.message ||
        "Please fix the form errors.";
      dispatch(setErrorMessage(message));
      return;
    }

    setCreating(true);

    try {
      const response = await fetch("/api/posts", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          imageUrl,
          caption,
          platforms,
          scheduledAt: scheduledAtISO,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        dispatch(
          setErrorMessage(data.error || "Failed to create post.")
        );
        return;
      }

      // Post successfully saved
      dispatch(clearDraft());
      dispatch(resetComposerUi());
      setIsScheduled(false);

      if (scheduledAtISO) {
        toast.success("Post Scheduled Successfully", {
          description: `Your post is queued for release on ${scheduleDate} at ${scheduleTime}.`,
        });
      } else {
        toast.success("Post Published Live", {
          description: "Your post has been broadcasted to LinkedIn!",
        });
      }
    } catch (error) {
      console.error("Create post error:", error);
      dispatch(
        setErrorMessage(
          "Something went wrong while creating the post."
        )
      );
    } finally {
      setCreating(false);
    }
  }

  async function handlePublishNow() {
    await submitPost(null);
  }

  async function handleSchedulePost() {
    if (!isScheduled) {
      setIsScheduled(true);
      return;
    }
    const scheduledAtISO = new Date(`${scheduleDate}T${scheduleTime}:00`).toISOString();
    await submitPost(scheduledAtISO);
  }

  return {
    creating,
    isScheduled,
    scheduleDate,
    scheduleTime,
    uploadStatus,
    errorMessage,
    setIsScheduled,
    setScheduleDate,
    setScheduleTime,
    handlePublishNow,
    handleSchedulePost,
  };
}
