"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Truck } from "lucide-react";

interface ShipmentFormProps {
  orderId: string;
  initialShipment?: {
    provider: string | null;
    trackingNumber: string | null;
    trackingUrl: string | null;
    status: string;
  } | null;
}

export default function ShipmentForm({ orderId, initialShipment }: ShipmentFormProps) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    provider: initialShipment?.provider || "",
    trackingNumber: initialShipment?.trackingNumber || "",
    trackingUrl: initialShipment?.trackingUrl || "",
    status: initialShipment?.status || "SHIPPED",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}/shipment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) throw new Error("Failed to update shipment");

      toast.success("Shipment details updated");
      router.refresh();
    } catch (error) {
      toast.error("Failed to update shipment");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-background border rounded-2xl shadow-sm p-6">
      <h2 className="text-lg font-bold mb-4 pb-2 border-b flex items-center gap-2">
        <Truck className="w-5 h-5 text-muted-foreground" /> Shipment Tracking
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Carrier Provider</label>
          <input 
            type="text" 
            placeholder="e.g. BlueDart, Delhivery" 
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
            value={formData.provider}
            onChange={e => setFormData({ ...formData, provider: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tracking Number</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
            value={formData.trackingNumber}
            onChange={e => setFormData({ ...formData, trackingNumber: e.target.value })}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium mb-1">Tracking URL</label>
          <input 
            type="url" 
            placeholder="https://..."
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
            value={formData.trackingUrl}
            onChange={e => setFormData({ ...formData, trackingUrl: e.target.value })}
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Status</label>
          <select 
            className="w-full px-3 py-2 border rounded-xl bg-transparent"
            value={formData.status}
            onChange={e => setFormData({ ...formData, status: e.target.value })}
          >
            <option value="PENDING">Pending</option>
            <option value="SHIPPED">Shipped</option>
            <option value="IN_TRANSIT">In Transit</option>
            <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
            <option value="DELIVERED">Delivered</option>
            <option value="RTO">Returned to Origin</option>
          </select>
        </div>

        <Button type="submit" disabled={isSubmitting} className="w-full">
          {isSubmitting ? "Saving..." : "Save Tracking Info"}
        </Button>
      </form>
    </div>
  );
}
