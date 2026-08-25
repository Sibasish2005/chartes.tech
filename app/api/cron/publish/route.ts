import { NextRequest, NextResponse } from "next/server";
import { processScheduledPosts } from "@/lib/automation/worker";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const cronSecret = process.env.CRON_SECRET;
    const authHeader = request.headers.get("authorization");

    /*
     * Validate Authorization header if CRON_SECRET is configured.
     * Expected format: "Authorization: Bearer <CRON_SECRET>"
     */
    if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    console.log("[Cron] Starting publishing worker");

    const result = await processScheduledPosts();

    console.log("[Cron] Worker finished", result);

    return NextResponse.json({
      success: true,
      ...result,
    });
  } catch (error) {
    console.error("[Cron] Publishing worker failed:", error);

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
