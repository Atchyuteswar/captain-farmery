"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function ReturnActionDialog({ 
  returnRequest 
}: { 
  returnRequest: any 
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    status: returnRequest.status,
    adminNotes: returnRequest.adminNotes || "",
    refundAmount: returnRequest.refundAmount || returnRequest.order.grandTotal,
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/returns/${returnRequest.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update return");

      toast.success("Return status updated");
      setIsOpen(false);
      router.refresh();
    } catch (error) {
      toast.error("Error updating return");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) {
    return (
      <Button variant="outline" size="sm" onClick={() => setIsOpen(true)}>
        Manage
      </Button>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="bg-background w-full max-w-md rounded-2xl p-6 shadow-lg border">
        <h2 className="text-lg font-bold mb-4">Process Return for Order #{returnRequest.order.orderNumber}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          
          <div>
            <label className="block text-sm font-medium mb-1">Status</label>
            <select 
              className="w-full px-3 py-2 border rounded-xl bg-transparent"
              value={formData.status}
              onChange={e => setFormData({ ...formData, status: e.target.value })}
            >
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
              <option value="RECEIVED">Item Received</option>
              <option value="REFUNDED">Refunded</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Refund Amount (₹)</label>
            <input 
              type="number" 
              step="0.01"
              className="w-full px-3 py-2 border rounded-xl bg-transparent"
              value={formData.refundAmount}
              onChange={e => setFormData({ ...formData, refundAmount: e.target.value })}
            />
            <p className="text-xs text-muted-foreground mt-1">Order total: ₹{returnRequest.order.grandTotal.toFixed(2)}</p>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Admin Notes (Visible to Customer)</label>
            <textarea 
              rows={3}
              className="w-full px-3 py-2 border rounded-xl bg-transparent"
              value={formData.adminNotes}
              onChange={e => setFormData({ ...formData, adminNotes: e.target.value })}
              placeholder="Reason for rejection, partial refund note, etc."
            />
          </div>

          <div className="flex gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setIsOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="flex-1">
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
