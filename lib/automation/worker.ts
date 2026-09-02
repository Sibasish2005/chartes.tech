import { prisma } from "@/lib/prisma";
import { publishToLinkedIn } from "./publisher/linkedin";
import { publishToFacebook } from "./publisher/facebook";
import { publishToInstagram } from "./publisher/instagram";

export async function processScheduledPosts() {
  const now = new Date();

  console.log(
    `[Automation] Looking for scheduled posts at ${now.toISOString()}`
  );

  const posts = await prisma.post.findMany({
    where: {
      status: "SCHEDULED",
      scheduledAt: {
        lte: now,
      },
    },

    include: {
      platform: true,
    },

    orderBy: {
      scheduledAt: "asc",
    },

    take: 10,
  });

  console.log(
    `[Automation] Found ${posts.length} scheduled post(s)`
  );

  let processed = 0;
  let published = 0;
  let failed = 0;

  for (const post of posts) {
    processed++;

    try {
      console.log(
        `[Automation] Processing post ${post.id}`
      );

      for (const platform of post.platform) {
        /*
         * Skip platforms that have already been published.
         *
         * This is important because the worker can run multiple
         * times and we don't want to publish the same platform
         * again after it has already succeeded.
         */
        if (platform.status === "PUBLISHED") {
          console.log(
            `[Automation] Skipping ${platform.platform} for ${post.id} - already published`
          );

          continue;
        }

        if (platform.platform === "LINKEDIN") {
          const result =
            await processLinkedInPost(
              post,
              platform.id
            );

          if (result) {
            published++;
          } else {
            failed++;
          }
        } else if (platform.platform === "FACEBOOK") {
          const result =
            await processFacebookPost(
              post,
              platform.id
            );

          if (result) {
            published++;
          } else {
            failed++;
          }
        } else if (platform.platform === "INSTAGRAM") {
          const result =
            await processInstagramPost(
              post,
              platform.id
            );

          if (result) {
            published++;
          } else {
            failed++;
          }
        } else {
          console.log(
            `[Automation] Platform ${platform.platform} is not implemented yet`
          );

          await prisma.postPlatform.update({
            where: {
              id: platform.id,
            },

            data: {
              status: "FAILED",
            },
          });

          failed++;
        }
      }

      /*
       * After processing all platforms, check their final
       * statuses before deciding what the parent Post status
       * should be.
       */
      const updatedPlatforms =
        await prisma.postPlatform.findMany({
          where: {
            postId: post.id,
          },
        });

      const allPublished =
        updatedPlatforms.length > 0 &&
        updatedPlatforms.every(
          (platform) =>
            platform.status === "PUBLISHED"
        );

      const anyFailed =
        updatedPlatforms.some(
          (platform) =>
            platform.status === "FAILED"
        );

      /*
       * If every target platform succeeded:
       *
       * Post:
       * SCHEDULED → PUBLISHED
       */
      if (allPublished) {
        await prisma.post.update({
          where: {
            id: post.id,
          },

          data: {
            status: "PUBLISHED",
          },
        });

        console.log(
          `[Automation] Post ${post.id} → PUBLISHED`
        );
      }

      /*
       * If at least one platform failed and none are
       * still pending, mark the overall post as failed.
       */
      else if (
        anyFailed &&
        updatedPlatforms.every(
          (platform) =>
            platform.status === "PUBLISHED" ||
            platform.status === "FAILED"
        )
      ) {
        await prisma.post.update({
          where: {
            id: post.id,
          },

          data: {
            status: "FAILED",
          },
        });

        console.log(
          `[Automation] Post ${post.id} → FAILED`
        );
      }
    } catch (error) {
      failed++;

      console.error(
        `[Automation] Error processing post ${post.id}:`,
        error
      );

      /*
       * If something unexpected happens, mark the post
       * as failed instead of leaving it permanently
       * stuck in SCHEDULED.
       */
      await prisma.post.update({
        where: {
          id: post.id,
        },

        data: {
          status: "FAILED",
        },
      });
    }
  }

  console.log(
    `[Automation] Finished. Processed: ${processed}, Published: ${published}, Failed: ${failed}`
  );

  return {
    processed,
    published,
    failed,
  };
}

/**
 * Process one LinkedIn platform publication.
 */
async function processLinkedInPost(
  post: {
    id: string;
    userId: string;
    caption: string | null;
    imageUrl: string | null;
  },
  postPlatformId: string
): Promise<boolean> {
  console.log(
    `[Automation] Publishing post ${post.id} to LinkedIn`
  );

  /*
   * Find the LinkedIn account belonging to the user
   * who created this post.
   */
  const account =
    await prisma.account.findFirst({
      where: {
        userId: post.userId,
        provider: "linkedin",
      },
    });

  /*
   * No LinkedIn account connected.
   */
  if (!account) {
    console.error(
      `[Automation] No LinkedIn account found for user ${post.userId}`
    );

    await prisma.postPlatform.update({
      where: {
        id: postPlatformId,
      },

      data: {
        status: "FAILED",
      },
    });

    return false;
  }

  /*
   * OAuth should have stored the access token when
   * LinkedIn was connected.
   */
  if (!account.accessToken) {
    console.error(
      `[Automation] LinkedIn account has no access token`
    );

    await prisma.postPlatform.update({
      where: {
        id: postPlatformId,
      },

      data: {
        status: "FAILED",
      },
    });

    return false;
  }

  /*
   * The LinkedIn OAuth callback stores the member ID
   * in providerAccountId.
   *
   * Example:
   *
   * providerAccountId = "abc123"
   *
   * becomes:
   *
   * urn:li:person:abc123
   */
  if (!account.providerAccountId) {
    console.error(
      `[Automation] LinkedIn account has no providerAccountId`
    );

    await prisma.postPlatform.update({
      where: {
        id: postPlatformId,
      },

      data: {
        status: "FAILED",
      },
    });

    return false;
  }

  const authorUrn =
    `urn:li:person:${account.providerAccountId}`;

  /*
   * Call the LinkedIn publisher.
   */
  const result =
    await publishToLinkedIn({
      accessToken: account.accessToken,
      authorUrn,
      caption: post.caption ?? "",
      imageUrl: post.imageUrl,
    });

  /*
   * Publishing failed.
   */
  if (!result.success) {
    console.error(
      `[Automation] LinkedIn publication failed for post ${post.id}:`,
      result.error
    );

    await prisma.postPlatform.update({
      where: {
        id: postPlatformId,
      },

      data: {
        status: "FAILED",
      },
    });

    return false;
  }

  /*
   * Publishing succeeded.
   */
  await prisma.postPlatform.update({
    where: {
      id: postPlatformId,
    },

    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log(
    `[Automation] LinkedIn publication succeeded for post ${post.id}`
  );

  return true;
}

/**
 * Process one Facebook platform publication.
 */
async function processFacebookPost(
  post: {
    id: string;
    userId: string;
    caption: string | null;
    imageUrl: string | null;
  },
  postPlatformId: string
): Promise<boolean> {
  console.log(
    `[Automation] Publishing post ${post.id} to Facebook`
  );

  const account = await prisma.account.findFirst({
    where: {
      userId: post.userId,
      provider: "facebook",
    },
  });

  if (!account || !account.accessToken || !account.providerAccountId) {
    console.error(
      `[Automation] Facebook account or credentials missing for user ${post.userId}`
    );

    await prisma.postPlatform.update({
      where: { id: postPlatformId },
      data: { status: "FAILED" },
    });

    return false;
  }

  const result = await publishToFacebook({
    pageAccessToken: account.accessToken,
    pageId: account.providerAccountId,
    caption: post.caption ?? "",
    imageUrl: post.imageUrl,
  });

  if (!result.success) {
    console.error(
      `[Automation] Facebook publication failed for post ${post.id}:`,
      result.error
    );

    await prisma.postPlatform.update({
      where: { id: postPlatformId },
      data: { status: "FAILED" },
    });

    return false;
  }

  await prisma.postPlatform.update({
    where: { id: postPlatformId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log(
    `[Automation] Facebook publication succeeded for post ${post.id}`
  );

  return true;
}

/**
 * Process one Instagram platform publication.
 */
async function processInstagramPost(
  post: {
    id: string;
    userId: string;
    caption: string | null;
    imageUrl: string | null;
  },
  postPlatformId: string
): Promise<boolean> {
  console.log(
    `[Automation] Publishing post ${post.id} to Instagram`
  );

  const account = await prisma.account.findFirst({
    where: {
      userId: post.userId,
      provider: "instagram",
    },
  });

  if (!account || !account.accessToken || !account.providerAccountId) {
    console.error(
      `[Automation] Instagram account or credentials missing for user ${post.userId}`
    );

    await prisma.postPlatform.update({
      where: { id: postPlatformId },
      data: { status: "FAILED" },
    });

    return false;
  }

  if (!post.imageUrl) {
    console.error(
      `[Automation] Instagram publication failed for post ${post.id}: Image URL is required`
    );

    await prisma.postPlatform.update({
      where: { id: postPlatformId },
      data: { status: "FAILED" },
    });

    return false;
  }

  const result = await publishToInstagram({
    accessToken: account.accessToken,
    igUserId: account.providerAccountId,
    caption: post.caption ?? "",
    imageUrl: post.imageUrl,
  });

  if (!result.success) {
    console.error(
      `[Automation] Instagram publication failed for post ${post.id}:`,
      result.error
    );

    await prisma.postPlatform.update({
      where: { id: postPlatformId },
      data: { status: "FAILED" },
    });

    return false;
  }

  await prisma.postPlatform.update({
    where: { id: postPlatformId },
    data: {
      status: "PUBLISHED",
      publishedAt: new Date(),
    },
  });

  console.log(
    `[Automation] Instagram publication succeeded for post ${post.id}`
  );

  return true;
}