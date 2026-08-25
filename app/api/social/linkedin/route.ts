import crypto from "crypto";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(req: Request){
    try {
        const user = await getCurrentUser();
        if(!user){
            return NextResponse.json({error: "Unauthorized"}, {status: 401});
        }
        const clientId = process.env.LINKEDIN_CLIENT_ID;
        const redirectUri = process.env.LINKEDIN_REDIRECT_URI;
        if (!clientId || !redirectUri) {
      return NextResponse.json(
        {
          error: "LinkedIn OAuth is not configured",
        },
        { status: 500 }
      );
    }
    const state = crypto.randomBytes(16).toString("hex");

    const params = new URLSearchParams({
        response_type: "code",
        client_id: clientId,
        redirect_uri: redirectUri,
        state: state,
        scope: "openid profile email w_member_social",
    })
    const LinkedInUrl = `https://www.linkedin.com/oauth/v2/authorization?${params.toString()}`;
    const response = NextResponse.redirect(LinkedInUrl);
    response.cookies.set({
        name: "linkedin_oauth_state",
        value: state,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path:"/",
        maxAge: 60*10
    });
    return response;
    }
    catch(error){
        console.log(error);
        return NextResponse.json(
            {error: "Internal Server Error"},
            {status: 500}
        )
    }
}
