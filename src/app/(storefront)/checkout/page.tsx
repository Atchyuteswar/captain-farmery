"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import Image from "next/image";
import { MapPin, Plus, CheckCircle2 } from "lucide-react";

// Add razorpay to window object types
declare global {
  interface Window {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    Razorpay: any;
  }
}

export default function CheckoutPage() {
  const router = useRouter();
  const { items, getTotalPrice, clearCart } = useCartStore();
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  const [savedAddresses, setSavedAddresses] = useState<any[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [useNewAddress, setUseNewAddress] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "", lastName: "", email: "", phone: "", address: "", city: "", state: "", pincode: ""
  });
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [couponError, setCouponError] = useState("");

  useEffect(() => {
    setMounted(true);
    
    // Fetch saved addresses if logged in
    async function fetchAddresses() {
      try {
        const res = await fetch("/api/account/addresses");
        if (res.ok) {
          const data = await res.json();
          setSavedAddresses(data);
          if (data.length > 0) {
            setSelectedAddressId(data[0].id);
          } else {
            setUseNewAddress(true);
          }
        } else {
          setUseNewAddress(true);
        }
      } catch {
        setUseNewAddress(true);
      }
    }
    fetchAddresses();
  }, []);

  const total = getTotalPrice();
  const shippingAmount = total > 999 ? 0 : 50;
  const grandTotal = total + shippingAmount - discountAmount;

  const applyCoupon = () => {
    if (couponCode.toUpperCase() === "WELCOME10") {
      setDiscountAmount(total * 0.1);
      setCouponError("");
    } else {
      setDiscountAmount(0);
      setCouponError("Invalid coupon code");
    }
  };

  const handlePayment = async () => {
    if (!window.Razorpay) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }

    if (!useNewAddress && !selectedAddressId) {
      alert("Please select a shipping address.");
      return;
    }

    if (useNewAddress && (!formData.firstName || !formData.address || !formData.phone)) {
      alert("Please fill out all required address fields.");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on our backend
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items, 
          totalAmount: total, 
          shippingAmount, 
          discountAmount, 
          formData: useNewAddress ? formData : null,
          shippingAddressId: useNewAddress ? undefined : selectedAddressId
        }),
      });
      const order = await res.json();

      if (order.error) throw new Error(order.error);

      // 2. Open Razorpay Checkout
      const options = {
        key: order.key_id,
        amount: order.amount,
        currency: order.currency,
        name: "Captain Farmery",
        description: "Premium Farm Products",
        order_id: order.id,
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        handler: async function (response: any) {
          // 3. Verify payment signature
          const verifyRes = await fetch("/api/checkout/verify-payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(response),
          });
          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            clearCart();
            router.push("/checkout/success");
          } else {
            alert("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: useNewAddress ? `${formData.firstName} ${formData.lastName}` : "",
          email: useNewAddress ? formData.email : "",
          contact: useNewAddress ? formData.phone : "",
        },
        theme: {
          color: "#2E7D32", // Brand Primary
        },
      };

      const rzp1 = new window.Razorpay(options);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      rzp1.on("payment.failed", function (response: any) {
        alert(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      alert("Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/shop")} className="rounded-full">Back to Shop</Button>
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      <div className="container mx-auto px-4 py-12">
        <h1 className="font-serif text-3xl font-bold mb-8">Checkout</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: Shipping */}
          <div className="lg:col-span-7 space-y-8">
            <div className="bg-background border rounded-3xl p-6 md:p-8 shadow-sm">
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-primary" />
                Delivery Address
              </h2>
              
              {/* Saved Addresses */}
              {!useNewAddress && savedAddresses.length > 0 && (
                <div className="space-y-4 mb-6">
                  {savedAddresses.map((addr) => (
                    <div 
                      key={addr.id}
                      onClick={() => setSelectedAddressId(addr.id)}
                      className={`p-4 border-2 rounded-2xl cursor-pointer transition-all ${
                        selectedAddressId === addr.id 
                          ? "border-primary bg-primary/5" 
                          : "border-border hover:border-primary/50"
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-bold">{addr.fullName}</span>
                            <span className="text-xs px-2 py-0.5 bg-muted rounded-full font-medium">
                              {addr.type}
                            </span>
                            {addr.isDefault && (
                              <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full font-bold">
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">{addr.line1}, {addr.line2}</p>
                          <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                          <p className="text-sm text-muted-foreground mt-2">Phone: {addr.phone}</p>
                        </div>
                        {selectedAddressId === addr.id && (
                          <CheckCircle2 className="text-primary w-6 h-6" />
                        )}
                      </div>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full rounded-xl" onClick={() => setUseNewAddress(true)}>
                    <Plus className="w-4 h-4 mr-2" /> Add a new address
                  </Button>
                </div>
              )}

              {/* New Address Form */}
              {(useNewAddress || savedAddresses.length === 0) && (
                <div className="space-y-4">
                  {savedAddresses.length > 0 && (
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="font-bold text-sm">New Address</h3>
                      <button 
                        onClick={() => setUseNewAddress(false)} 
                        className="text-sm text-primary font-medium hover:underline"
                      >
                        Use saved address
                      </button>
                    </div>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="text" placeholder="First Name *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                    <input type="text" placeholder="Last Name" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                    <input type="email" placeholder="Email Address *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, email: e.target.value})} />
                    <input type="tel" placeholder="Phone Number *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, phone: e.target.value})} />
                    <input type="text" placeholder="Street Address *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, address: e.target.value})} />
                    <input type="text" placeholder="City *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, city: e.target.value})} />
                    <input type="text" placeholder="State *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, state: e.target.value})} />
                    <input type="text" placeholder="PIN Code *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, pincode: e.target.value})} />
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column: Order Summary */}
          <div className="lg:col-span-5">
            <div className="bg-secondary/30 rounded-3xl p-6 md:p-8 sticky top-24">
              <h2 className="text-xl font-bold mb-6">Order Summary</h2>
              
              <div className="space-y-4 mb-6 max-h-64 overflow-y-auto pr-2">
                {items.map(item => (
                  <div key={item.id} className="flex items-center gap-4 bg-background p-3 rounded-2xl shadow-sm border border-border/50">
                    <div className="w-16 h-16 bg-muted rounded-xl overflow-hidden shrink-0 relative">
                      <Image src={item.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200&auto=format&fit=crop"} alt={item.name} fill className="object-cover" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-sm line-clamp-1">{item.name}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{item.variantName || "Standard"}</p>
                      <p className="text-xs text-muted-foreground mt-1">Qty: {item.quantity} × ₹{item.price}</p>
                    </div>
                    <p className="font-bold">₹{item.price * item.quantity}</p>
                  </div>
                ))}
              </div>

              {/* Promo Code */}
              <div className="pt-2 pb-6 border-b border-border/50">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Coupon Code (try WELCOME10)" 
                    className="border rounded-xl px-4 py-2 bg-background focus:ring-primary focus:border-primary flex-1 text-sm uppercase"
                    value={couponCode}
                    onChange={e => setCouponCode(e.target.value)}
                  />
                  <Button variant="default" onClick={applyCoupon} className="rounded-xl px-6">Apply</Button>
                </div>
                {couponError && <p className="text-destructive text-xs mt-2 font-medium">{couponError}</p>}
                {discountAmount > 0 && <p className="text-green-600 text-xs mt-2 font-medium">Coupon applied successfully!</p>}
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Subtotal (incl. taxes)</span>
                  <span className="font-medium">₹{total.toFixed(2)}</span>
                </div>
                
                {discountAmount > 0 && (
                  <div className="flex justify-between text-sm text-green-600 font-medium">
                    <span>Discount applied</span>
                    <span>-₹{discountAmount.toFixed(2)}</span>
                  </div>
                )}
                
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Shipping Estimate</span>
                  <span className="font-medium">
                    {shippingAmount === 0 ? (
                      <span className="text-green-600">Free</span>
                    ) : (
                      `₹${shippingAmount.toFixed(2)}`
                    )}
                  </span>
                </div>
                
                {shippingAmount > 0 && (
                  <p className="text-xs text-muted-foreground text-right">
                    Add ₹{(999 - total).toFixed(2)} more for free shipping
                  </p>
                )}

                <div className="flex justify-between text-xl font-bold pt-4 border-t border-border/50 mt-4">
                  <span>Total Amount</span>
                  <span className="text-primary">₹{grandTotal.toFixed(2)}</span>
                </div>
                <p className="text-xs text-muted-foreground text-right">
                  Prices are inclusive of all taxes
                </p>
              </div>

              <Button 
                className="w-full h-14 mt-8 rounded-full text-lg shadow-lift bg-primary hover:bg-primary/90 text-primary-foreground"
                onClick={handlePayment}
                disabled={isProcessing}
              >
                {isProcessing ? "Processing Securely..." : `Proceed to Pay ₹${grandTotal.toFixed(2)}`}
              </Button>
              
              <div className="mt-4 flex items-center justify-center gap-2 text-xs text-muted-foreground">
                <svg viewBox="0 0 24 24" fill="none" className="w-4 h-4" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect><path d="M7 11V7a5 5 0 0 1 10 0v4"></path></svg>
                Payments are secure and encrypted
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
