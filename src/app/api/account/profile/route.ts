import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function PUT(request: Request) {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const { name, phone } = await request.json();

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: {
        name: name || null,
        phone: phone || null,
      },
    });

    return NextResponse.json({ message: "Profile updated", user: { name: user.name, phone: user.phone } });
  } catch (error) {
    console.error("Profile update error:", error);
    return new NextResponse("Failed to update profile", { status: 500 });
  }
}
