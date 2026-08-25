import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { provider } = body;

    if (!provider || typeof provider !== "string") {
      return NextResponse.json(
        { error: "Valid provider name is required" },
        { status: 400 }
      );
    }

    // Delete linked accounts for this user and provider
    const result = await prisma.account.deleteMany({
      where: {
        userId: user.id,
        provider: provider.toLowerCase(),
      },
    });

    return NextResponse.json({
      success: true,
      count: result.count,
      message: `${provider} account disconnected successfully`,
    });
  } catch (error) {
    console.error("Disconnect account error:", error);
    return NextResponse.json(
      { error: "Failed to disconnect account" },
      { status: 500 }
    );
  }
}
