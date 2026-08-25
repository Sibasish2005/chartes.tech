import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(request: NextRequest) {
    try {
        const code = request.nextUrl.searchParams.get("code");
        const state = request.nextUrl.searchParams.get("state");
        const error = request.nextUrl.searchParams.get("error");


        // User cancelled LinkedIn authorization
        if (error) {
            console.error(
                "LinkedIn OAuth error:",
                error,
                request.nextUrl.searchParams.get("error_description")
            )

            return NextResponse.redirect(new URL(
                "/connected-accounts?linkedin=cancelled",
                request.url));
        }
        if (!code || !state) {
            return NextResponse.redirect(
                new URL(
                    "/connected-accounts?linkedin=failed",
                    request.url
                )
            );
        }

        // 1. Verify OAuth state
        const savedState =
            request.cookies.get("linkedin_oauth_state")?.value;

        if (!savedState || savedState !== state) {
            console.error("LinkedIn OAuth state mismatch");

            return NextResponse.json(
                { error: "Invalid OAuth state" },
                { status: 401 }
            );
        }
        // 2. Get logged-in application user
        const sessionToken =
            request.cookies.get("session_token")?.value;

        if (!sessionToken) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }

        const session = await prisma.session.findUnique({
            where: {
                sessionToken,
            },
        });

        if (!session || session.expiresAt < new Date()) {
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }
        // 3. Environment variables
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const clientSecret =
            process.env.LINKEDIN_CLIENT_SECRET;
        const redirectUri =
            process.env.LINKEDIN_REDIRECT_URI;

        if (!clientId || !clientSecret || !redirectUri) {
            throw new Error(
                "LinkedIn OAuth environment variables are missing"
            );
        }

        // 4. Exchange authorization code for access token
        const tokenResponse = await fetch(
            "https://www.linkedin.com/oauth/v2/accessToken",
            {
                method: "POST",
                headers: {
                    "Content-Type":
                        "application/x-www-form-urlencoded",
                },
                body: new URLSearchParams({
                    grant_type: "authorization_code",
                    code,
                    client_id: clientId,
                    client_secret: clientSecret,
                    redirect_uri: redirectUri,
                }),
            }
        );
        const tokenData = await tokenResponse.json();

        if (!tokenResponse.ok) {
            console.error(
                "LinkedIn token exchange failed:",
                tokenData
            );

            return NextResponse.json(
                {
                    error: "LinkedIn token exchange failed",
                    details: tokenData,
                },
                { status: 400 }
            );
        }

        const accessToken = tokenData.access_token;

        if (!accessToken) {
            throw new Error(
                "LinkedIn did not return an access token"
            );
        }

        // 5. Calculate token expiration
        const expiresAt = tokenData.expires_in
            ? new Date(
                Date.now() + tokenData.expires_in * 1000
            )
            : null;

        // 6. Get LinkedIn member information (OpenID Connect userinfo)
        const profileResponse = await fetch(
            "https://api.linkedin.com/v2/userinfo",
            {
                headers: {
                    Authorization: `Bearer ${accessToken}`,
                },
            }
        );

        const profileData = await profileResponse.json();

        if (!profileResponse.ok) {
            console.error(
                "LinkedIn profile request failed:",
                profileData
            );

            return NextResponse.json(
                {
                    error: "Unable to get LinkedIn profile",
                    details: profileData,
                },
                { status: 400 }
            );
        }

        const linkedinMemberId = profileData.sub || profileData.id;

        if (!linkedinMemberId) {
            throw new Error(
                "LinkedIn member ID was not returned"
            );
        }
        // 7. Save LinkedIn account
        await prisma.account.upsert({
            where: {
                provider_providerAccountId: {
                    provider: "linkedin",
                    providerAccountId: linkedinMemberId,
                },
            },

            update: {
                accessToken,
                expiresAt,
            },

            create: {
                userId: session.userId,
                provider: "linkedin",
                providerAccountId: linkedinMemberId,
                accessToken,
                expiresAt,
            },
        });
        // 8. Remove OAuth state cookie
        const response = NextResponse.redirect(
            new URL(
                "/connected-accounts?linkedin=connected",
                request.url
            )
        );

        response.cookies.delete("linkedin_oauth_state");

        return response;




    }
    catch (error) {
        console.log(error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        )
    }
}