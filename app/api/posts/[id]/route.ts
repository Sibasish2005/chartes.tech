import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id: postId } = await context.params;

    if (!postId) {
      return NextResponse.json({ error: "Post ID required" }, { status: 400 });
    }

    // Verify post ownership
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post || post.userId !== user.id) {
      return NextResponse.json(
        { error: "Post not found or unauthorized" },
        { status: 404 }
      );
    }

    // Delete post (cascade will delete PostPlatform)
    await prisma.post.delete({
      where: { id: postId },
    });

    return NextResponse.json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (error) {
    console.error("Delete post error:", error);
    return NextResponse.json(
      { error: "Failed to delete post" },
      { status: 500 }
    );
  }
}
