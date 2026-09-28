"use client";

import { useState, useEffect } from "react";
import { Plus, MapPin, Trash2, Home, Briefcase, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface Address {
  id: string;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  pincode: string;
  type: string;
  isDefault: boolean;
}

export default function AccountAddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", type: "HOME", isDefault: false,
  });

  const fetchAddresses = async () => {
    try {
      const res = await fetch("/api/account/addresses");
      if (res.ok) {
        const data = await res.json();
        setAddresses(data);
      }
    } catch {
      toast.error("Failed to load addresses");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAddresses();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const res = await fetch("/api/account/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        toast.success("Address added!");
        setShowForm(false);
        setFormData({ fullName: "", phone: "", line1: "", line2: "", city: "", state: "", pincode: "", type: "HOME", isDefault: false });
        fetchAddresses();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to add address");
      }
    } catch {
      toast.error("Something went wrong");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/account/addresses?id=${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Address deleted");
        setAddresses(addresses.filter(a => a.id !== id));
      } else {
        toast.error("Failed to delete address");
      }
    } catch {
      toast.error("Something went wrong");
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="w-8 h-8 animate-spin text-muted-foreground" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="font-serif text-3xl font-bold mb-2">Saved Addresses</h1>
          <p className="text-muted-foreground">Manage your delivery addresses</p>
        </div>
        <Button onClick={() => setShowForm(!showForm)} className="rounded-full shadow-lift h-10 px-6">
          <Plus className="w-4 h-4 mr-2" /> {showForm ? "Cancel" : "Add New"}
        </Button>
      </div>

      {/* Add Address Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-background border rounded-3xl p-6 md:p-8 space-y-6">
          <h3 className="text-xl font-bold border-b pb-4">New Address</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input required type="text" placeholder="Full Name" value={formData.fullName} onChange={e => setFormData({...formData, fullName: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            <input required type="tel" placeholder="Phone Number" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            <input required type="text" placeholder="Address Line 1" value={formData.line1} onChange={e => setFormData({...formData, line1: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" />
            <input type="text" placeholder="Address Line 2 (optional)" value={formData.line2} onChange={e => setFormData({...formData, line2: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" />
            <input required type="text" placeholder="City" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            <input required type="text" placeholder="State" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            <input required type="text" placeholder="PIN Code" value={formData.pincode} onChange={e => setFormData({...formData, pincode: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary">
              <option value="HOME">Home</option>
              <option value="WORK">Work</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="rounded" />
            Set as default address
          </label>
          <div className="flex justify-end">
            <Button type="submit" disabled={isSaving} className="rounded-full px-8 h-12 shadow-lift">
              {isSaving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : "Save Address"}
            </Button>
          </div>
        </form>
      )}

      {/* Address Cards */}
      {addresses.length === 0 && !showForm ? (
        <div className="bg-background border rounded-3xl p-12 text-center flex flex-col items-center">
          <MapPin className="w-16 h-16 text-muted-foreground/30 mb-4" />
          <h3 className="font-bold text-xl mb-2">No saved addresses</h3>
          <p className="text-muted-foreground mb-6">You haven&apos;t saved any delivery addresses yet.</p>
          <Button variant="outline" className="rounded-full" onClick={() => setShowForm(true)}>
            <Plus className="w-4 h-4 mr-2" /> Add Address
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {addresses.map((address) => (
            <div key={address.id} className="bg-background border rounded-3xl p-6 relative group hover:shadow-subtle transition-shadow">
              <div className="flex items-center gap-2 mb-3">
                {address.type === "WORK" ? <Briefcase className="w-4 h-4 text-primary" /> : <Home className="w-4 h-4 text-primary" />}
                <span className="text-xs font-bold uppercase text-primary">{address.type}</span>
                {address.isDefault && (
                  <span className="text-xs font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full ml-auto">Default</span>
                )}
              </div>
              <p className="font-bold">{address.fullName}</p>
              <p className="text-sm text-muted-foreground">{address.line1}{address.line2 ? `, ${address.line2}` : ""}</p>
              <p className="text-sm text-muted-foreground">{address.city}, {address.state} — {address.pincode}</p>
              <p className="text-sm text-muted-foreground mt-1">📞 {address.phone}</p>
              <button
                onClick={() => handleDelete(address.id)}
                className="absolute top-4 right-4 p-2 rounded-full hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors opacity-0 group-hover:opacity-100"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
