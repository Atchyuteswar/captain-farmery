import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

export default function CheckoutSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-24 min-h-[70vh] flex items-center justify-center">
      <div className="max-w-md w-full bg-background p-8 rounded-3xl shadow-card text-center">
        <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="font-serif text-3xl font-bold mb-4">Order Successful!</h1>
        <p className="text-muted-foreground mb-8">
          Thank you for shopping with Captain Farmery. Your pure, farm-fresh products are being prepared and will be shipped soon.
        </p>
        
        <div className="space-y-4">
          <Link href="/account/orders" className={`${buttonVariants({ variant: "default" })} w-full h-12 rounded-full shadow-lift flex items-center justify-center`}>
            View Order Status
          </Link>
          <Link href="/shop" className={`${buttonVariants({ variant: "outline" })} w-full h-12 rounded-full flex items-center justify-center`}>
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  );
}
