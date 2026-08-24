import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import crypto from "crypto";
import { prisma } from "@/lib/prisma";
import { signinSchema } from "@/lib/validations/auth";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const result = signinSchema.safeParse(body);

    if (!result.success) {
      const errorMessage = result.error.issues[0]?.message || "Invalid input data";
      return NextResponse.json(
        { error: errorMessage, details: result.error.flatten() },
        { status: 400 }
      );
    }

    const { email, password } = result.data;
    const normalizedEmail = email.trim().toLowerCase();

    const user = await prisma.user.findUnique({
      where: {
        email: normalizedEmail,
      },
    });

    if (!user || !user.passwordHash) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const passwordMatches = await bcrypt.compare(
      password,
      user.passwordHash
    );

    if (!passwordMatches) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionToken = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 7);

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expiresAt,
      },
    });

    const response = NextResponse.json({
      message: "Login successful",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
    });

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
    console.error("Login Error:", error);
    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}