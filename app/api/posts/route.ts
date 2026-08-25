import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { createPostSchema } from "@/lib/validations/post";
import { processScheduledPosts } from "@/lib/automation/worker";

export async function POST(request: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const result = createPostSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json(
        { error: errorMessage, details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { imageUrl, caption, platforms, scheduledAt } = result.data;

    const scheduledDate = scheduledAt ? new Date(scheduledAt) : new Date();
    const isDueImmediately = scheduledDate <= new Date();

    const post = await prisma.post.create({
      data: {
        userId: user.id,
        imageUrl,
        caption: caption || null,
        status: "SCHEDULED",
        scheduledAt: scheduledDate,
        platform: {
          create: platforms.map((platform) => ({
            platform,
          })),
        },
      },
      include: {
        platform: true,
      },
    });

    if (isDueImmediately) {
      // Trigger worker asynchronously to immediately process due posts
      processScheduledPosts().catch((err) =>
        console.error("[Post API] Immediate worker trigger error:", err)
      );
    }

    return NextResponse.json(
      {
        message: "Post created successfully",
        post,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Create post error:", error);

    return NextResponse.json(
      {
        error: "Failed to create post",
      },
      { status: 500 }
    );
  }
}