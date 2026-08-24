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

  // Local state only for server request state
  const [creating, setCreating] =
    useState(false);

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

  // -----------------------------
  // Create post
  // -----------------------------

  async function handleCreatePost() {
    dispatch(setErrorMessage(""));

    const validationResult = createPostSchema.safeParse({
      imageUrl,
      caption,
      platforms,
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
      const response = await fetch(
        "/api/posts",
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            imageUrl,
            caption,
            platforms,
          }),
        }
      );

      const data =
        await response.json();

      if (!response.ok) {
        dispatch(
          setErrorMessage(
            data.error ||
              "Failed to create post."
          )
        );

        return;
      }

      // Post successfully saved
      dispatch(clearDraft());

      dispatch(
        resetComposerUi()
      );

      alert(
        "Post created successfully."
      );
    } catch (error) {
      console.error(
        "Create post error:",
        error
      );

      dispatch(
        setErrorMessage(
          "Something went wrong while creating the post."
        )
      );
    } finally {
      setCreating(false);
    }
  }

  return (
    <main className="mx-auto w-full max-w-5xl space-y-6 p-6">
      {/* Header */}

      <div>
        <h1 className="text-3xl font-bold">
          Create Post
        </h1>

        <p className="mt-2 text-muted-foreground">
          Create and prepare a social-media
          post for multiple platforms.
        </p>
      </div>

      {/* Preview / Edit tabs */}

      <div className="flex gap-2">
        <Button
          type="button"
          variant={
            previewTab === "EDIT"
              ? "default"
              : "outline"
          }
          onClick={() =>
            dispatch(
              setPreviewTab("EDIT")
            )
          }
        >
          Edit
        </Button>

        <Button
          type="button"
          variant={
            previewTab === "PREVIEW"
              ? "default"
              : "outline"
          }
          onClick={() =>
            dispatch(
              setPreviewTab("PREVIEW")
            )
          }
        >
          Preview
        </Button>
      </div>

      {/* EDIT */}

      {previewTab === "EDIT" && (
        <div className="grid gap-6 md:grid-cols-2">
          {/* Image */}

          <Card className="space-y-4 p-6">
            <div>
              <h2 className="text-lg font-semibold">
                Image
              </h2>

              <p className="text-sm text-muted-foreground">
                Upload your post image.
              </p>
            </div>

            <input
              type="file"
              accept="image/*"
              onChange={
                handleImageUpload
              }
              disabled={
                uploadStatus ===
                "UPLOADING"
              }
              className="w-full rounded-md border p-3"
            />

            {uploadStatus ===
              "UPLOADING" && (
              <div className="space-y-2">
                <div className="h-2 overflow-hidden rounded bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{
                      width: `${uploadProgress}%`,
                    }}
                  />
                </div>

                <p className="text-sm text-muted-foreground">
                  Uploading...{" "}
                  {uploadProgress}%
                </p>
              </div>
            )}

            {imageUrl && (
              <img
                src={imageUrl}
                alt="Post preview"
                className="max-h-[400px] w-full rounded-lg object-contain"
              />
            )}
          </Card>

          {/* Caption + platforms */}

          <Card className="space-y-6 p-6">
            {/* Caption */}

            <div className="space-y-2">
              <Label htmlFor="caption">
                Caption
              </Label>

              <Textarea
                id="caption"
                value={caption}
                onChange={(event) =>
                  dispatch(
                    setCaption(
                      event.target.value
                    )
                  )
                }
                placeholder="Write your caption..."
                rows={8}
              />

              <p className="text-xs text-muted-foreground">
                {caption.length} characters
              </p>
            </div>

            {/* Platforms */}

            <div className="space-y-3">
              <Label>
                Platforms
              </Label>

              {availablePlatforms.map(
                (platform) => (
                  <div
                    key={
                      platform.value
                    }
                    className="flex items-center gap-3"
                  >
                    <Checkbox
                      id={
                        platform.value
                      }
                      checked={platforms.includes(
                        platform.value
                      )}
                      onCheckedChange={() =>
                        dispatch(
                          togglePlatform(
                            platform.value
                          )
                        )
                      }
                    />

                    <Label
                      htmlFor={
                        platform.value
                      }
                    >
                      {platform.label}
                    </Label>
                  </div>
                )
              )}
            </div>

            {/* Submit */}

            <Button
              type="button"
              className="w-full"
              disabled={
                creating ||
                uploadStatus ===
                  "UPLOADING"
              }
              onClick={
                handleCreatePost
              }
            >
              {creating
                ? "Creating Post..."
                : "Create Post"}
            </Button>
          </Card>
        </div>
      )}

      {/* PREVIEW */}

      {previewTab ===
        "PREVIEW" && (
        <Card className="mx-auto max-w-md overflow-hidden">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Social post"
              className="w-full object-cover"
            />
          ) : (
            <div className="flex aspect-square items-center justify-center bg-muted">
              <p className="text-sm text-muted-foreground">
                Upload an image to
                preview the post.
              </p>
            </div>
          )}

          <div className="space-y-4 p-5">
            <p className="whitespace-pre-wrap text-sm">
              {caption ||
                "Your caption will appear here."}
            </p>

            <div className="flex flex-wrap gap-2">
              {platforms.length > 0 ? (
                platforms.map(
                  (platform) => (
                    <span
                      key={platform}
                      className="rounded-full border px-3 py-1 text-xs"
                    >
                      {platform}
                    </span>
                  )
                )
              ) : (
                <span className="text-xs text-muted-foreground">
                  No platforms selected
                </span>
              )}
            </div>
          </div>
        </Card>
      )}

      {/* Error */}

      {errorMessage && (
        <div className="rounded-md border border-destructive/50 p-4 text-sm text-destructive">
          {errorMessage}
        </div>
      )}

      {/* Upload success */}

      {uploadStatus ===
        "SUCCESS" && (
        <p className="text-sm text-green-600">
          Image uploaded successfully.
        </p>
      )}
    </main>
  );
}
