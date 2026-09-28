import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: { id: string } }) {
  try {
    const data = await req.json();
    const faq = await prisma.fAQ.update({
      where: { id: params.id },
      data: {
        question: data.question,
        answer: data.answer,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }
    });
    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update FAQ" }, { status: 500 });
  }
}
