import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import ProductForm from "../ProductForm";

export default async function EditProductPage({ params }: { params: { slug: string } }) {
  const { slug } = await params;
  
  const [product, categories] = await Promise.all([
    prisma.product.findUnique({
      where: { slug },
      include: {
        images: true,
        variants: true
      }
    }),
    prisma.category.findMany({
      orderBy: { name: "asc" }
    })
  ]);

  if (!product) {
    notFound();
  }

  return <ProductForm product={product} categories={categories} isEdit={true} />;
}
