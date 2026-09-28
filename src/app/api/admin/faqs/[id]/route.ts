import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function PUT(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = await req.json();
    // @ts-ignore
    const faqClient = prisma.faq || prisma.fAQ;
    const faq = await faqClient.update({
      where: { id },
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
