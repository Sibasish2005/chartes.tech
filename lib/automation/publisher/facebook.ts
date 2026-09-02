interface FacebookPublishInput {
  pageAccessToken: string;
  pageId: string;
  caption: string;
  imageUrl?: string | null;
}

interface PublishResult {
  success: boolean;
  externalPostId?: string;
  error?: string;
}

/**
 * Publishes a photo post or text status to a Facebook Page via Graph API v21.0.
 */
export async function publishToFacebook({
  pageAccessToken,
  pageId,
  caption,
  imageUrl,
}: FacebookPublishInput): Promise<PublishResult> {
  try {
    let url: string;
    let body: Record<string, string>;

    if (imageUrl) {
      // Photo Post to Page feed
      url = `https://graph.facebook.com/v21.0/${pageId}/photos`;
      body = {
        url: imageUrl,
        message: caption,
        access_token: pageAccessToken,
      };
    } else {
      // Plain text status post
      url = `https://graph.facebook.com/v21.0/${pageId}/feed`;
      body = {
        message: caption,
        access_token: pageAccessToken,
      };
    }

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    if (!res.ok) {
      console.error("[Facebook Publish Error]", data);
      return {
        success: false,
        error: data?.error?.message || "Failed to publish to Facebook",
      };
    }

    return {
      success: true,
      externalPostId: data.id || data.post_id,
    };
  } catch (error) {
    console.error("[Facebook Publish Exception]", error);
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Unknown error publishing to Facebook",
    };
  }
}
