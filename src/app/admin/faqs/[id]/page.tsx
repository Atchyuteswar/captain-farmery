import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import FAQForm from "../FAQForm";

export default async function EditFAQPage({ params }: { params: { id: string } }) {
  // @ts-ignore
  const faq = await prisma.fAQ.findUnique({
    where: { id: params.id }
  });

  if (!faq) {
    notFound();
  }

  return <FAQForm faq={faq} />;
}
