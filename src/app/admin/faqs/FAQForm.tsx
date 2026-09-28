"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { ArrowLeft, Save } from "lucide-react";
import Link from "next/link";

interface FAQFormProps {
  faq?: {
    id: string;
    question: string;
    answer: string;
    isActive: boolean;
    sortOrder: number;
  };
}

export default function FAQForm({ faq }: FAQFormProps) {
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsPending(true);
    
    const formData = new FormData(e.currentTarget);
    const data = {
      question: formData.get("question") as string,
      answer: formData.get("answer") as string,
      isActive: formData.get("isActive") === "true",
      sortOrder: parseInt(formData.get("sortOrder") as string) || 0,
    };

    try {
      const url = faq ? `/api/admin/faqs/${faq.id}` : "/api/admin/faqs";
      const res = await fetch(url, {
        method: faq ? "PUT" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error("Failed to save FAQ");

      toast.success(`FAQ ${faq ? "updated" : "created"} successfully`);
      router.push("/admin/faqs");
      router.refresh();
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setIsPending(false);
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/admin/faqs" className="text-muted-foreground hover:text-foreground">
          <ArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold">{faq ? "Edit FAQ" : "New FAQ"}</h1>
          <p className="text-muted-foreground">Fill in the details below</p>
        </div>
      </div>

      <form onSubmit={onSubmit} className="bg-background border rounded-2xl p-6 shadow-sm space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Question</label>
          <input 
            name="question" 
            defaultValue={faq?.question || ""}
            required
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20" 
            placeholder="e.g. Do you use preservatives?"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Answer</label>
          <textarea 
            name="answer"
            defaultValue={faq?.answer || ""}
            required
            rows={5}
            className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20 resize-none"
            placeholder="Provide a detailed answer here..."
          />
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Sort Order</label>
            <input 
              name="sortOrder"
              type="number"
              defaultValue={faq?.sortOrder || 0}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">Status</label>
            <select 
              name="isActive"
              defaultValue={faq?.isActive === false ? "false" : "true"}
              className="w-full border rounded-lg p-3 outline-none focus:ring-2 focus:ring-primary/20"
            >
              <option value="true">Active</option>
              <option value="false">Hidden</option>
            </select>
          </div>
        </div>

        <div className="pt-4 border-t flex justify-end">
          <Button type="submit" disabled={isPending} className="px-8">
            <Save className="w-4 h-4 mr-2" />
            {isPending ? "Saving..." : "Save FAQ"}
          </Button>
        </div>
      </form>
    </div>
  );
}
