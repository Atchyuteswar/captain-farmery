import { Button } from "@/components/ui/button";

export default function AdminSettingsPage() {
  return (
    <div className="space-y-8 max-w-3xl">
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-muted-foreground">Manage your store configuration</p>
      </div>

      {/* Store Info */}
      <div className="bg-background border rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold border-b pb-4">Store Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Store Name</label>
            <input
              type="text"
              defaultValue="Captain Farmery"
              className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Support Email</label>
            <input
              type="email"
              defaultValue="hello@captainfarmery.com"
              className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Support Phone</label>
            <input
              type="tel"
              defaultValue="+91 98765 43210"
              className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Currency</label>
            <input
              type="text"
              defaultValue="INR"
              disabled
              className="w-full border rounded-xl px-4 py-3 bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
          </div>
        </div>
      </div>

      {/* Shipping */}
      <div className="bg-background border rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold border-b pb-4">Shipping</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Free Shipping Threshold (₹)</label>
            <input
              type="number"
              defaultValue="999"
              className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Flat Shipping Rate (₹)</label>
            <input
              type="number"
              defaultValue="50"
              className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary"
            />
          </div>
        </div>
      </div>

      {/* Payments */}
      <div className="bg-background border rounded-2xl p-6 md:p-8 space-y-6">
        <h2 className="text-xl font-bold border-b pb-4">Payment Gateway</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Razorpay Key ID</label>
            <input
              type="text"
              defaultValue="••••••••••••"
              disabled
              className="w-full border rounded-xl px-4 py-3 bg-muted/50 text-muted-foreground cursor-not-allowed"
            />
            <p className="text-xs text-muted-foreground">Configured via environment variables</p>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Payment Status</label>
            <div className="flex items-center gap-2 px-4 py-3">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              <span className="text-sm font-medium text-green-700">Connected</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button className="rounded-full px-8 h-12 shadow-lift">
          Save Settings
        </Button>
      </div>
    </div>
  );
}
