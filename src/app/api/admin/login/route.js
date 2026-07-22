import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { signToken } from "@/lib/jwt";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid Email" },
        { status: 401 }
      );
    }

    if (user.role !== "ADMIN") {
      return NextResponse.json(
        { error: "Not an Admin" },
        { status: 403 }
      );
    }

    const valid = await bcrypt.compare(password, user.password);

    if (!valid) {
      return NextResponse.json(
        { error: "Wrong Password" },
        { status: 401 }
      );
    }

    const token = signToken({
      userId: user.id,
      role: user.role,
    });

    const response = NextResponse.json({
      success: true,
      user: { id: user.id, name: user.name, email: user.email, role: user.role },
    });

    response.cookies.set("token", token, {
      httpOnly: true,
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Admin login error:", error);
    return NextResponse.json(
      { error: "Internal server error. Please try again." },
      { status: 500 }
    );
  }
}
