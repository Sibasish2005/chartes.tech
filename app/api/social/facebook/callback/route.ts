import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get("code");
    const state = request.nextUrl.searchParams.get("state");
    const error = request.nextUrl.searchParams.get("error");

    if (error) {
      console.error("Meta OAuth error:", error, request.nextUrl.searchParams.get("error_description"));
      return NextResponse.redirect(new URL("/connected-accounts?meta=cancelled", request.url));
    }

    if (!code || !state) {
      return NextResponse.redirect(new URL("/connected-accounts?meta=failed", request.url));
    }

    // 1. Verify CSRF state
    const savedState = request.cookies.get("meta_oauth_state")?.value;
    if (!savedState || savedState !== state) {
      return NextResponse.json({ error: "Invalid OAuth state" }, { status: 401 });
    }

    // 2. Verify logged-in session
    const sessionToken = request.cookies.get("session_token")?.value;
    if (!sessionToken) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const session = await prisma.session.findUnique({
      where: { sessionToken },
    });
    if (!session || session.expiresAt < new Date()) {
      return NextResponse.redirect(new URL("/login", request.url));
    }

    const clientId = process.env.META_APP_ID;
    const clientSecret = process.env.META_APP_SECRET;
    const redirectUri = process.env.META_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error("Meta OAuth environment variables are missing");
    }

    // 3. Exchange code for short-lived access token
    const tokenUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    tokenUrl.searchParams.set("client_id", clientId);
    tokenUrl.searchParams.set("client_secret", clientSecret);
    tokenUrl.searchParams.set("redirect_uri", redirectUri);
    tokenUrl.searchParams.set("code", code);

    const tokenRes = await fetch(tokenUrl.toString());
    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || !tokenData.access_token) {
      console.error("[Meta Token Exchange Error]", tokenData);
      return NextResponse.json({ error: "Meta token exchange failed", details: tokenData }, { status: 400 });
    }

    // 4. Exchange short-lived token for Long-Lived Token (60 days)
    const longLivedUrl = new URL("https://graph.facebook.com/v21.0/oauth/access_token");
    longLivedUrl.searchParams.set("grant_type", "fb_exchange_token");
    longLivedUrl.searchParams.set("client_id", clientId);
    longLivedUrl.searchParams.set("client_secret", clientSecret);
    longLivedUrl.searchParams.set("fb_exchange_token", tokenData.access_token);

    const longLivedRes = await fetch(longLivedUrl.toString());
    const longLivedData = await longLivedRes.json();
    const userAccessToken = longLivedData.access_token || tokenData.access_token;

    // 5. Fetch Facebook Pages and connected Instagram Business Accounts
    const accountsRes = await fetch(
      `https://graph.facebook.com/v21.0/me/accounts?fields=id,name,access_token,instagram_business_account{id,username}&access_token=${userAccessToken}`
    );
    const accountsData = await accountsRes.json();
    const pages = accountsData.data || [];

    if (pages.length === 0) {
      return NextResponse.redirect(
        new URL("/connected-accounts?error=no_facebook_pages_found", request.url)
      );
    }

    // 6. Save Facebook Pages & linked Instagram Accounts to database
    for (const page of pages) {
      // Upsert Facebook Page Account
      await prisma.account.upsert({
        where: {
          provider_providerAccountId: {
            provider: "facebook",
            providerAccountId: page.id,
          },
        },
        update: {
          userId: session.userId,
          accessToken: page.access_token, // Page Access Token does not expire
        },
        create: {
          userId: session.userId,
          provider: "facebook",
          providerAccountId: page.id,
          accessToken: page.access_token,
        },
      });

      // Upsert connected Instagram Account (if linked)
      if (page.instagram_business_account?.id) {
        await prisma.account.upsert({
          where: {
            provider_providerAccountId: {
              provider: "instagram",
              providerAccountId: page.instagram_business_account.id,
            },
          },
          update: {
            userId: session.userId,
            accessToken: page.access_token, // Page token is used to publish to Instagram
          },
          create: {
            userId: session.userId,
            provider: "instagram",
            providerAccountId: page.instagram_business_account.id,
            accessToken: page.access_token,
          },
        });
      }
    }

    // 7. Cleanup state cookie and redirect back
    const response = NextResponse.redirect(
      new URL("/connected-accounts?meta=connected", request.url)
    );
    response.cookies.delete("meta_oauth_state");
    return response;
  } catch (error) {
    console.error("[Meta Callback Error]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
