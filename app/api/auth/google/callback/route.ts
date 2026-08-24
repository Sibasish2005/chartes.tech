import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
  try {
    // 1. Get authorization code from Google
    const code = request.nextUrl.searchParams.get("code");

    if (!code) {
      return NextResponse.redirect(
        new URL("/login?error=google_auth_failed", request.url)
      );
    }

    // 2. Get Google credentials from environment
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = process.env.GOOGLE_REDIRECT_URI;

    if (!clientId || !clientSecret || !redirectUri) {
      throw new Error(
        "Google OAuth environment variables are missing"
      );
    }

    // 3. Exchange authorization code for Google tokens
    const tokenResponse = await fetch(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          code,
          client_id: clientId,
          client_secret: clientSecret,
          redirect_uri: redirectUri,
          grant_type: "authorization_code",
        }),
      }
    );

    const tokenData = await tokenResponse.json();

    if (!tokenResponse.ok) {
      console.error("Google token error:", tokenData);

      return NextResponse.redirect(
        new URL("/login?error=google_auth_failed", request.url)
      );
    }

    const accessToken = tokenData.access_token;

    // 4. Ask Google for the authenticated user's information
    const userInfoResponse = await fetch(
      "https://openidconnect.googleapis.com/v1/userinfo",
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    const googleUser = await userInfoResponse.json();

    if (!userInfoResponse.ok || !googleUser.email) {
      return NextResponse.redirect(
        new URL("/login?error=google_user_failed", request.url)
      );
    }

    // 5. Extract Google identity
    const googleAccountId = googleUser.sub;
    const email = googleUser.email.toLowerCase();
    const name = googleUser.name ?? null;

    // 6. Find existing application user
    let user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // 7. Create user if they don't already exist
    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          name,
          passwordHash: null,
        },
      });
    }

    // 8. Connect Google account to our user
    await prisma.account.upsert({
      where: {
        provider_providerAccountId: {
          provider: "google",
          providerAccountId: googleAccountId,
        },
      },
      update: {
        accessToken,
      },
      create: {
        userId: user.id,
        provider: "google",
        providerAccountId: googleAccountId,
        accessToken,
      },
    });

    // 9. Create our application's session
    const sessionToken = crypto
      .randomBytes(32)
      .toString("hex");

    const expiresAt = new Date(
      Date.now() + 1000 * 60 * 60 * 24 * 7
    );

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    // 10. Redirect to automation
    const response = NextResponse.redirect(
      new URL("/automation", request.url)
    );

    // 11. Give browser our session cookie
    response.cookies.set({
      name: "session_token",
      value: sessionToken,
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      expires: expiresAt,
    });

    return response;
  } catch (error) {
    console.error("Google OAuth error:", error);

    return NextResponse.redirect(
      new URL("/login?error=google_auth_failed", request.url)
    );
  }
}