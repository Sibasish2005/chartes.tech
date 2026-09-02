interface InstagramPublishInput {
  accessToken: string;
  igUserId: string;
  caption: string;
  imageUrl: string;
}

interface PublishResult {
  success: boolean;
  externalPostId?: string;
  error?: string;
}

/**
 * Publishes an image post to an Instagram Professional account using the
 * 2-step container creation & publishing workflow via Graph API v21.0.
 */
export async function publishToInstagram({
  accessToken,
  igUserId,
  caption,
  imageUrl,
}: InstagramPublishInput): Promise<PublishResult> {
  try {
    if (!imageUrl) {
      return {
        success: false,
        error: "Instagram requires an image for feed posts",
      };
    }

    // Step 1: Create Media Container
    const containerUrl = new URL(
      `https://graph.facebook.com/v21.0/${igUserId}/media`
    );

    const containerRes = await fetch(containerUrl.toString(), {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        image_url: imageUrl,
        caption: caption || "",
        access_token: accessToken,
      }),
    });

    const containerData = await containerRes.json();

    if (!containerRes.ok || !containerData.id) {
      console.error("[Instagram Container Error]", containerData);
      return {
        success: false,
        error:
          containerData?.error?.message ||
          "Failed to create Instagram media container",
      };
    }

    const creationId = containerData.id;

    // Step 2: Poll container status until ready (max 5 checks)
    let isReady = false;
    for (let attempt = 0; attempt < 5; attempt++) {
      // Short backoff delay
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const statusRes = await fetch(
        `https://graph.facebook.com/v21.0/${creationId}?fields=status_code&access_token=${accessToken}`
      );
      const statusData = await statusRes.json();

      if (statusData?.status_code === "FINISHED") {
        isReady = true;
        break;
      } else if (statusData?.status_code === "ERROR") {
        return {
          success: false,
          error: "Instagram media container processing failed",
        };
      }
    }

    // If still not ready after polling, wait 1 more second and attempt publish
    if (!isReady) {
      await new Promise((resolve) => setTimeout(resolve, 1000));
    }

    // Step 3: Publish Media Container
    const publishUrl = `https://graph.facebook.com/v21.0/${igUserId}/media_publish`;
    const publishRes = await fetch(publishUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        creation_id: creationId,
        access_token: accessToken,
      }),
    });

    const publishData = await publishRes.json();

    if (!publishRes.ok || !publishData.id) {
      console.error("[Instagram Publish Error]", publishData);
      return {
        success: false,
        error:
          publishData?.error?.message ||
          "Failed to publish Instagram media container",
      };
    }

    return {
      success: true,
      externalPostId: publishData.id,
    };
  } catch (error) {
    console.error("[Instagram Publish Exception]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error publishing to Instagram",
    };
  }
}
