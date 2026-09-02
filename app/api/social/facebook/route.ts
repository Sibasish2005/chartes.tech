import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const clientId = process.env.META_APP_ID;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!clientId || !redirectUri) {
      return NextResponse.json(
        { error: "Meta OAuth is not configured" },
        { status: 500 }
      );
    }

    const state = crypto.randomBytes(16).toString("hex");

    // Scopes needed for Facebook Pages and Instagram publishing
    const scopes = [
      "pages_show_list",
      "pages_read_engagement",
      "pages_manage_posts",
      "instagram_basic",
      "instagram_content_publish",
      "business_management",
    ].join(",");

    const params = new URLSearchParams({
      client_id: clientId,
      redirect_uri: redirectUri,
      state: state,
      scope: scopes,
      response_type: "code",
    });

    const metaAuthUrl = `https://www.facebook.com/v21.0/dialog/oauth?${params.toString()}`;

    const response = NextResponse.redirect(metaAuthUrl);
    response.cookies.set({
      name: "meta_oauth_state",
      value: state,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 10, // 10 minutes
    });

    return response;
  } catch (error) {
    console.error("[Meta OAuth Init Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
