import { NextResponse } from "next/server";

export async function GET() {
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const  redirectUri=process.env.GOOGLE_REDIRECT_URI;
    if(!clientId || !redirectUri){
        return NextResponse.json(
      {
        error: "Google OAuth is not configured",
      },
      { status: 500 }
    );
    }
    const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: redirectUri,
        response_type: "code",
        scope: "openid email profile",
        access_type: "offline",
        prompt: "select_account",
    });

    const googleUrl =
    `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;


    return NextResponse.redirect(googleUrl);
   
}
