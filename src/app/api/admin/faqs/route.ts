import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const faq = await prisma.fAQ.create({
      data: {
        question: data.question,
        answer: data.answer,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }
    });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
