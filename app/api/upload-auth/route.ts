import { NextResponse } from "next/server";
import { getUploadAuthParams } from "@imagekit/next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET() {
    try {
        const user = await getCurrentUser();

        if(!user){
         return NextResponse.json({error:"Unauthorized"},{status:401});  
        }
        const publicKey=process.env.IMAGEKIT_PUBLIC_KEY;
        const privateKey=process.env.IMAGEKIT_PRIVATE_KEY;
        if(!publicKey||!privateKey){
            throw new Error("Missing Imagekit credentials in env")
        }
        const {token,expire,signature} = getUploadAuthParams({
            privateKey:privateKey,
            publicKey:publicKey,
            
        })
        return NextResponse.json({
            token,
            expire,
            signature,
            publicKey
        })


    } catch (error) {
       console.error(
      "ImageKit authentication error:",
      error
    );

    return NextResponse.json(
      {
        error: "Unable to generate upload credentials",
      },
      { status: 500 }
    );
  
    }
}