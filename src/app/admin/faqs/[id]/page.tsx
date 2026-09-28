import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FAQForm from "../FAQForm";

export default async function EditFAQPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  // @ts-ignore
  const faq = await prisma.fAQ.findUnique({
    where: { id }
  });

  if (!faq) {
    notFound();
  }

  return <FAQForm faq={faq} />;
}
