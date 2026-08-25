import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const accounts = await prisma.account.findMany({
      where: { userId: user.id },
      select: { provider: true },
    });

    const connectedProviders = accounts.map((a) => a.provider.toUpperCase());

    return NextResponse.json({ connected: connectedProviders });
  } catch (error) {
    console.error("Failed to fetch connected accounts:", error);
    return NextResponse.json(
      { error: "Failed to fetch connected accounts" },
      { status: 500 }
    );
  }
}
