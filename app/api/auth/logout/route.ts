import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";



export async function POST() {
    try {
        const cookieSession = await cookies();
        const sessionToken = cookieSession.get("session_token")?.value;
        if (sessionToken) {
            await prisma.session.deleteMany({
                where: {
                    sessionToken,
                },
            });
        }
        cookieSession.delete("session_token");

        return NextResponse.json({
            message: "User logout Successful",
        }, {
            status: 200
        })


    } catch (error) {
        console.error("Logout error:", error);

        return NextResponse.json(
            {
                error: "Something went wrong",
            },
            { status: 500 }
        );

    }
}

