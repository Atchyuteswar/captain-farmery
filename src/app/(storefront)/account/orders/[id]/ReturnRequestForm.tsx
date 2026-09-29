"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { RotateCcw } from "lucide-react";

export default function ReturnRequestForm({ orderId }: { orderId: string }) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [formData, setFormData] = useState({
    reason: "",
    condition: "",
    comments: "",
    refundMethod: "ORIGINAL",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch("/api/returns", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, orderId }),
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || "Failed to submit request");

      toast.success("Return request submitted successfully");
      setIsOpen(false);
      router.refresh();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="outline" onClick={() => setIsOpen(true)} className="w-full flex items-center gap-2">
        <RotateCcw className="w-4 h-4" /> Request Return
      </Button>
    );
  }

  return (
    <div className="bg-muted/50 border rounded-2xl p-4 mt-4">
      <h3 className="font-bold mb-4">Request a Return</h3>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Reason for Return *</label>
          <select 
            required
            className="w-full px-3 py-2 border rounded-xl bg-background"
            value={formData.reason}
            onChange={e => setFormData({ ...formData, reason: e.target.value })}
          >
            <option value="">Select a reason</option>
            <option value="DEFECTIVE">Damaged or defective</option>
            <option value="WRONG_ITEM">Wrong item received</option>
            <option value="NOT_AS_DESCRIBED">Item not as described</option>
            <option value="OTHER">Other</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Item Condition</label>
          <select 
            className="w-full px-3 py-2 border rounded-xl bg-background"
            value={formData.condition}
            onChange={e => setFormData({ ...formData, condition: e.target.value })}
          >
            <option value="">Select condition</option>
            <option value="UNOPENED">Unopened / Sealed</option>
            <option value="OPENED">Opened but unused</option>
            <option value="USED">Used / Tested</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Refund Method *</label>
          <select 
            required
            className="w-full px-3 py-2 border rounded-xl bg-background"
            value={formData.refundMethod}
            onChange={e => setFormData({ ...formData, refundMethod: e.target.value })}
          >
            <option value="ORIGINAL">Original Payment Method</option>
            <option value="WALLET">Store Credit / Wallet</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Additional Comments</label>
          <textarea 
            rows={3}
            className="w-full px-3 py-2 border rounded-xl bg-background"
            value={formData.comments}
            onChange={e => setFormData({ ...formData, comments: e.target.value })}
            placeholder="Please provide any additional details..."
          />
        </div>

        <div className="flex gap-2 pt-2">
          <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
            Cancel
          </Button>
          <Button type="submit" disabled={isSubmitting} className="flex-1">
            {isSubmitting ? "Submitting..." : "Submit Request"}
          </Button>
        </div>
      </form>
    </div>
  );
}
