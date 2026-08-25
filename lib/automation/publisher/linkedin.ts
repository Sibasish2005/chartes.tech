interface LinkedInPublishInput {
  accessToken: string;
  authorUrn: string;
  caption: string;
  imageUrl?: string | null;
}

interface LinkedInPublishResult {
  success: boolean;
  externalPostId?: string;
  error?: string;
}

/**
 * Uploads an image asset to LinkedIn using the 2-step REST Images API:
 * 1. Initialize upload: POST /rest/images?action=initializeUpload
 * 2. PUT image binary data to uploadUrl
 * Returns the LinkedIn image URN (urn:li:image:...) or null if upload fails.
 */
async function uploadImageToLinkedIn(
  accessToken: string,
  authorUrn: string,
  imageUrl: string
): Promise<string | null> {
  try {
    // 1. Download image from CDN (ImageKit)
    const imageRes = await fetch(imageUrl);
    if (!imageRes.ok) {
      console.error(
        `[LinkedIn Image] Failed to download image from ${imageUrl}: ${imageRes.statusText}`
      );
      return null;
    }
    const contentType = imageRes.headers.get("content-type") || "image/jpeg";
    const imageBuffer = await imageRes.arrayBuffer();

    // 2. Initialize upload with LinkedIn REST Images API
    const initRes = await fetch(
      "https://api.linkedin.com/rest/images?action=initializeUpload",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
          "LinkedIn-Version": "202601",
          "X-Restli-Protocol-Version": "2.0.0",
        },
        body: JSON.stringify({
          initializeUploadRequest: {
            owner: authorUrn,
          },
        }),
      }
    );

    if (!initRes.ok) {
      const initError = await initRes.text();
      console.error("[LinkedIn Image] initializeUpload failed:", initError);
      return null;
    }

    const initData = await initRes.json();
    const uploadUrl = initData?.value?.uploadUrl;
    const imageUrn = initData?.value?.image;

    if (!uploadUrl || !imageUrn) {
      console.error(
        "[LinkedIn Image] Missing uploadUrl or imageUrn from LinkedIn",
        initData
      );
      return null;
    }

    // 3. Upload raw binary buffer to uploadUrl
    const uploadRes = await fetch(uploadUrl, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": contentType,
      },
      body: imageBuffer,
    });

    if (!uploadRes.ok) {
      const uploadError = await uploadRes.text();
      console.error("[LinkedIn Image] Binary upload failed:", uploadError);
      return null;
    }

    console.log(
      `[LinkedIn Image] Image uploaded successfully. URN: ${imageUrn}`
    );
    return imageUrn;
  } catch (error) {
    console.error(
      "[LinkedIn Image] Error during image upload process:",
      error
    );
    return null;
  }
}

export async function publishToLinkedIn(
  input: LinkedInPublishInput
): Promise<LinkedInPublishResult> {
  // If an imageUrl is provided, upload the media first to obtain a LinkedIn Image URN
  let imageUrn: string | null = null;
  if (input.imageUrl) {
    console.log(`[LinkedIn Publisher] Uploading image asset: ${input.imageUrl}`);
    imageUrn = await uploadImageToLinkedIn(
      input.accessToken,
      input.authorUrn,
      input.imageUrl
    );
  }

  // Construct request payload
  const bodyPayload: Record<string, unknown> = {
    author: input.authorUrn,
    commentary: input.caption,
    visibility: "PUBLIC",
    distribution: {
      feedDistribution: "MAIN_FEED",
    },
    lifecycleState: "PUBLISHED",
    isReshareDisabledByAuthor: false,
  };

  // Attach media if image was successfully uploaded
  if (imageUrn) {
    bodyPayload.content = {
      media: {
        title: "Post Image",
        id: imageUrn,
      },
    };
  }

  const response = await fetch(
    "https://api.linkedin.com/rest/posts",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${input.accessToken}`,
        "Content-Type": "application/json",
        "LinkedIn-Version": "202601",
        "X-Restli-Protocol-Version": "2.0.0",
      },
      body: JSON.stringify(bodyPayload),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error("LinkedIn publish failed:", errorText);

    return {
      success: false,
      error: errorText,
    };
  }

  const postId = response.headers.get("x-restli-id");

  return {
    success: true,
    externalPostId: postId ?? undefined,
  };
}