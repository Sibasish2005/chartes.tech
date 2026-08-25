import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { publishToLinkedIn } from "@/lib/automation/publisher/linkedin";

export async function GET() {
  try {
    // 1. Check logged-in user
    const user = await getCurrentUser();

    if (!user) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // 2. Find connected LinkedIn account
    const account = await prisma.account.findFirst({
      where: {
        userId: user.id,
        provider: "linkedin",
      },
    });

    if (!account) {
      return NextResponse.json(
        {
          error: "LinkedIn account is not connected",
        },
        { status: 400 }
      );
    }

    // 3. Make sure we have the OAuth token
    if (!account.accessToken) {
      return NextResponse.json(
        {
          error: "LinkedIn access token is missing",
        },
        { status: 400 }
      );
    }

    // 4. Make sure we have the LinkedIn member ID
    if (!account.providerAccountId) {
      return NextResponse.json(
        {
          error: "LinkedIn member ID is missing",
        },
        { status: 400 }
      );
    }

    // 5. LinkedIn author URN
    const authorUrn =
      `urn:li:person:${account.providerAccountId}`;

    // 6. Publish test post
    const result = await publishToLinkedIn({
      accessToken: account.accessToken,
      authorUrn,
      caption:
        "🚀 Test post from chartes.tech automation engine.",
    });

    // 7. Return result
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "LinkedIn post published successfully",
      externalPostId: result.externalPostId,
    });
  } catch (error) {
    console.error(
      "[LinkedIn Test] Error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      { status: 500 }
    );
  }
}