"use client";

import {
  ChangeEvent,
  useState,
} from "react";

import {
  upload,
  ImageKitAbortError,
  ImageKitInvalidRequestError,
  ImageKitServerError,
  ImageKitUploadNetworkError,
} from "@imagekit/next";

import {
  useAppDispatch,
  useAppSelector,
  useCreatePost,
} from "@/lib/hooks";

import {
  setImageUrl,
  setCaption,
  togglePlatform,
  clearDraft,
  type Platform,
} from "@/lib/features/postDraft/postDraftSlice";

import {
  setPreviewTab,
  setUploadStatus,
  setUploadProgress,
  setErrorMessage,
  resetComposerUi,
} from "@/lib/features/composerUi/composerUiSlice";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { createPostSchema } from "@/lib/validations/post";
import AppLayout from "@/components/layout/AppLayout";
import { Zap, Clock, Calendar } from "lucide-react";

const availablePlatforms: {
  value: Platform;
  label: string;
}[] = [
  {
    value: "INSTAGRAM",
    label: "Instagram",
  },
  {
    value: "FACEBOOK",
    label: "Facebook",
  },
  {
    value: "LINKEDIN",
    label: "LinkedIn",
  },
];

export default function CreatePostPage() {
  const dispatch = useAppDispatch();

  // -----------------------------
  // Redux: draft state
  // -----------------------------

  const {
    imageUrl,
    caption,
    platforms,
  } = useAppSelector(
    (state) => state.postDraft
  );

  // -----------------------------
  // Redux: UI state
  // -----------------------------

  const {
    previewTab,
    uploadStatus,
    uploadProgress,
    errorMessage,
  } = useAppSelector(
    (state) => state.composerUi
  );

  // -----------------------------
  // Custom Hook: Post Creation & Scheduling Logic
  // -----------------------------
  const {
    creating,
    isScheduled,
    scheduleDate,
    scheduleTime,
    setIsScheduled,
    setScheduleDate,
    setScheduleTime,
    handlePublishNow,
    handleSchedulePost,
  } = useCreatePost();

  // -----------------------------
  // ImageKit authentication
  // -----------------------------

  async function authenticator() {
    const response = await fetch(
      "/api/upload-auth"
    );

    if (!response.ok) {
      const text = await response.text();

      throw new Error(
        `ImageKit authentication failed: ${text}`
      );
    }

    const data = await response.json();

    return {
      token: data.token,
      signature: data.signature,
      expire: data.expire,
      publicKey: data.publicKey,
    };
  }

  // -----------------------------
  // Image upload
  // -----------------------------

  async function handleImageUpload(
    event: ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    dispatch(
      setUploadStatus("UPLOADING")
    );

    dispatch(setUploadProgress(0));

    dispatch(setErrorMessage(""));

    try {
      const authParams =
        await authenticator();

      const result = await upload({
        file,
        fileName: file.name,

        token: authParams.token,
        signature:
          authParams.signature,
        expire: authParams.expire,
        publicKey:
          authParams.publicKey,

        folder: "/social-manager",

        useUniqueFileName: true,

        onProgress: (event) => {
          if (!event.total) {
            return;
          }

          const progress = Math.round(
            (event.loaded /
              event.total) *
              100
          );

          dispatch(
            setUploadProgress(progress)
          );
        },
      });

      if (!result.url) {
        throw new Error("Failed to receive image URL from ImageKit.");
      }

      dispatch(
        setImageUrl(result.url)
      );

      dispatch(
        setUploadStatus("SUCCESS")
      );

      dispatch(
        setUploadProgress(100)
      );
    } catch (error) {
      console.error(
        "ImageKit upload error:",
        error
      );

      let message =
        "Image upload failed.";

      if (
        error instanceof
        ImageKitAbortError
      ) {
        message =
          "Upload was cancelled.";
      } else if (
        error instanceof
        ImageKitInvalidRequestError
      ) {
        message =
          `Invalid upload request: ${error.message}`;
      } else if (
        error instanceof
        ImageKitUploadNetworkError
      ) {
        message =
          `Network error: ${error.message}`;
      } else if (
        error instanceof
        ImageKitServerError
      ) {
        message =
          `ImageKit server error: ${error.message}`;
      } else if (
        error instanceof Error
      ) {
        message = error.message;
      }

      dispatch(
        setUploadStatus("ERROR")
      );

      dispatch(
        setErrorMessage(message)
      );
    }
  }



  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header Hero */}
        <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 lg:p-7 flex flex-col md:flex-row md:items-center justify-between gap-5 shadow-xs">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">
              Create Social Post
            </h1>
            <p className="text-neutral-500 text-xs lg:text-sm max-w-xl">
              Compose, optimize, and orchestrate visual content with real-time multi-platform previews.
            </p>
          </div>

          {/* Preview / Edit tabs */}
          <div className="inline-flex p-1 rounded-full bg-neutral-100 border border-[#EAE3D9]">
            <button
              type="button"
              onClick={() => dispatch(setPreviewTab("EDIT"))}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                previewTab === "EDIT"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Edit Mode
            </button>
            <button
              type="button"
              onClick={() => dispatch(setPreviewTab("PREVIEW"))}
              className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
                previewTab === "PREVIEW"
                  ? "bg-white text-neutral-900 shadow-xs font-semibold"
                  : "text-neutral-500 hover:text-neutral-900"
              }`}
            >
              Live Device Preview
            </button>
          </div>
        </div>

        {/* EDIT MODE */}
        {previewTab === "EDIT" && (
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Image Upload Card */}
            <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 shadow-xs space-y-4">
              <div>
                <h2 className="text-sm font-bold text-neutral-900">Media Asset</h2>
                <p className="text-xs text-neutral-500 mt-0.5">
                  Upload post image (ImageKit CDN).
                </p>
              </div>

              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={uploadStatus === "UPLOADING"}
                  className="w-full rounded-xl border border-[#EAE3D9] bg-[#FAF8F5] p-2.5 text-xs file:mr-3 file:py-1.5 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-medium file:bg-[#18181B] file:text-white hover:file:bg-neutral-800 cursor-pointer"
                />
              </div>

              {uploadStatus === "UPLOADING" && (
                <div className="space-y-1.5 p-3 rounded-xl bg-neutral-50">
                  <div className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
                    <div
                      className="h-full bg-neutral-800 transition-all duration-300"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                  <p className="text-xs text-neutral-500 text-center">
                    Uploading... {uploadProgress}%
                  </p>
                </div>
              )}

              {uploadStatus === "SUCCESS" && (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-medium flex items-center justify-between">
                  <span>✓ Media uploaded to ImageKit CDN</span>
                </div>
              )}

              {imageUrl ? (
                <div className="relative rounded-xl overflow-hidden border border-[#EAE3D9] bg-neutral-900 aspect-video flex items-center justify-center">
                  <img
                    src={imageUrl}
                    alt="Post preview"
                    className="max-h-[300px] w-full object-contain"
                  />
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-[#EAE3D9] bg-[#FAF8F5]/60 p-10 text-center text-neutral-400 text-xs">
                  No image selected yet.
                </div>
              )}
            </div>

            {/* Caption & Platforms Card */}
            <div className="bg-white rounded-2xl border border-[#EAE3D9] p-6 shadow-xs space-y-5 flex flex-col justify-between">
              <div className="space-y-4">
                {/* Caption Input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="caption" className="text-xs font-semibold text-neutral-700">
                      Post Caption
                    </Label>
                    <span className="text-[11px] text-neutral-400">
                      {caption.length} characters
                    </span>
                  </div>

                  <Textarea
                    id="caption"
                    value={caption}
                    onChange={(event) => dispatch(setCaption(event.target.value))}
                    placeholder="Write your thought-leadership caption..."
                    rows={6}
                    className="rounded-xl border-[#EAE3D9] bg-[#FAF8F5] focus:bg-white text-xs text-neutral-900"
                  />
                </div>

                {/* Target Platforms */}
                <div className="space-y-2.5 pt-2 border-t border-[#EAE3D9]/60">
                  <Label className="text-xs font-semibold text-neutral-700">
                    Distribution Channels
                  </Label>

                  <div className="grid grid-cols-3 gap-2">
                    {availablePlatforms.map((platform) => {
                      const isSelected = platforms.includes(platform.value);
                      return (
                        <button
                          type="button"
                          key={platform.value}
                          onClick={() => dispatch(togglePlatform(platform.value))}
                          className={`p-2.5 rounded-xl border text-xs font-medium flex items-center justify-between transition-all ${
                            isSelected
                              ? "bg-[#18181B] text-white border-black shadow-xs font-semibold"
                              : "bg-[#FAF8F5] text-neutral-700 border-[#EAE3D9] hover:bg-white"
                          }`}
                        >
                          <span>{platform.label}</span>
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isSelected ? "bg-white" : "bg-neutral-300"
                            }`}
                          />
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Scheduling & Timing Controls */}
                <div className="space-y-3 pt-3 border-t border-[#EAE3D9]/60">
                  <div className="flex items-center justify-between">
                    <Label className="text-xs font-semibold text-neutral-700">
                      Publishing Schedule
                    </Label>
                    <button
                      type="button"
                      onClick={() => setIsScheduled(!isScheduled)}
                      className="text-[11px] font-medium text-neutral-600 hover:text-neutral-900 underline"
                    >
                      {isScheduled ? "Cancel Scheduling" : "Set Custom Date & Time"}
                    </button>
                  </div>

                  {/* Date & Time Picker */}
                  {isScheduled ? (
                    <div className="p-3.5 bg-[#FAF8F5] rounded-xl border border-[#EAE3D9] space-y-3">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                        <div>
                          <label className="text-[11px] font-medium text-neutral-600 block mb-1">
                            Publish Date
                          </label>
                          <input
                            type="date"
                            min={new Date().toISOString().split("T")[0]}
                            value={scheduleDate}
                            onChange={(e) => setScheduleDate(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#EAE3D9] bg-white text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>

                        <div>
                          <label className="text-[11px] font-medium text-neutral-600 block mb-1">
                            Publish Time
                          </label>
                          <input
                            type="time"
                            value={scheduleTime}
                            onChange={(e) => setScheduleTime(e.target.value)}
                            className="w-full px-3 py-1.5 rounded-lg border border-[#EAE3D9] bg-white text-xs text-neutral-900 focus:outline-none focus:ring-1 focus:ring-black"
                          />
                        </div>
                      </div>

                      <p suppressHydrationWarning className="text-[11px] text-neutral-500 flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-neutral-400" />
                        <span>
                          Will be queued for automated publishing on{" "}
                          <strong className="text-neutral-800">
                            {new Date(`${scheduleDate}T${scheduleTime}:00`).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                            })}
                          </strong>{" "}
                          at <strong className="text-neutral-800">{scheduleTime}</strong>
                        </span>
                      </p>
                    </div>
                  ) : (
                    <p className="text-[11px] text-neutral-500">
                      Post will be published live immediately, or click <strong>Schedule Timing</strong> below to pick a future date.
                    </p>
                  )}
                </div>
              </div>

              {/* Submit CTAs: Separate Publish Now & Schedule Timing buttons */}
              <div className="pt-3 border-t border-[#EAE3D9]/60 space-y-2.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {/* Button 1: Publish Now */}
                  <Button
                    type="button"
                    className="w-full py-4.5 rounded-full bg-[#18181B] text-white text-xs font-medium hover:bg-neutral-800 transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                    disabled={creating || uploadStatus === "UPLOADING"}
                    onClick={handlePublishNow}
                  >
                    <Zap className="w-3.5 h-3.5" />
                    <span>
                      {creating && !isScheduled
                        ? "Publishing Live..."
                        : "Publish Now"}
                    </span>
                  </Button>

                  {/* Button 2: Schedule Timing */}
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full py-4.5 rounded-full border border-neutral-300 bg-white text-neutral-800 text-xs font-medium hover:bg-[#FAF8F5] transition-all shadow-xs disabled:opacity-50 flex items-center justify-center gap-1.5"
                    disabled={creating || uploadStatus === "UPLOADING"}
                    onClick={handleSchedulePost}
                  >
                    <Clock className="w-3.5 h-3.5 text-neutral-600" />
                    <span>
                      {creating && isScheduled
                        ? "Scheduling Post..."
                        : isScheduled
                        ? "Confirm Schedule"
                        : "Schedule Timing"}
                    </span>
                  </Button>
                </div>

                {errorMessage && (
                  <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-medium text-center">
                    {errorMessage}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* PREVIEW MODE */}
        {previewTab === "PREVIEW" && (
          <div className="max-w-md mx-auto bg-white rounded-2xl border border-[#EAE3D9] shadow-sm overflow-hidden">
            <div className="p-3.5 border-b border-[#EAE3D9] bg-[#FAF8F5] flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full bg-[#18181B] text-white flex items-center justify-center font-bold text-[11px]">
                  C
                </div>
                <div>
                  <p className="text-xs font-semibold text-neutral-900">chartes.tech</p>
                  <p className="text-[10px] text-neutral-500">Social Feed Preview</p>
                </div>
              </div>
              <span className="text-[10px] font-medium px-2 py-0.5 rounded-full bg-neutral-100 text-neutral-600">
                Mockup
              </span>
            </div>

            {imageUrl ? (
              <img
                src={imageUrl}
                alt="Social post"
                className="w-full aspect-square object-cover"
              />
            ) : (
              <div className="flex aspect-video items-center justify-center bg-neutral-50 text-neutral-400 text-xs">
                Upload an image to preview.
              </div>
            )}

            <div className="p-4 space-y-3">
              <p className="whitespace-pre-wrap text-xs text-neutral-800 leading-relaxed">
                {caption || "Your caption will appear here."}
              </p>

              <div className="pt-2 border-t border-[#EAE3D9]/60 flex flex-wrap gap-1">
                {platforms.length > 0 ? (
                  platforms.map((platform) => (
                    <span
                      key={platform}
                      className="rounded-full px-2 py-0.5 text-[10px] font-medium bg-neutral-100 text-neutral-600 border border-neutral-200"
                    >
                      {platform}
                    </span>
                  ))
                ) : (
                  <span className="text-[10px] text-neutral-400">
                    No platforms selected
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </AppLayout>
  );
}
