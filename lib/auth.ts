import { cookies } from "next/headers";
import { prisma } from "./prisma";

export async function getCurrentUser() {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("session_token")?.value;
    if(!sessionToken){
        return null;
    }
    const session = await prisma.session.findUnique({
        where:{
            sessionToken
        },
        include: {
            user:true,
        },
    });

    if(!session){
        return null
    }
    if(session.expiresAt< new Date()){
        await prisma.session.delete({
            where:{
                id:session.id,
            },
        });
        return null;
    }
    return session.user
}

