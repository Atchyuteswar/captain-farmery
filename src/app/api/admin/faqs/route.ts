import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // @ts-ignore
    const faqClient = prisma.faq || prisma.fAQ;
    const faq = await faqClient.create({
      data: {
        question: data.question,
        answer: data.answer,
        isActive: data.isActive,
        sortOrder: data.sortOrder,
      }
    });

    revalidatePath("/", "layout");

    return NextResponse.json(faq);
  } catch (error) {
    return NextResponse.json({ error: "Failed to create FAQ" }, { status: 500 });
  }
}
