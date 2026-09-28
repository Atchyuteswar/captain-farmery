"use client";

import { useEffect, useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import Script from "next/script";
import Image from "next/image";
import { Lock, MapPin, Plus, CheckCircle2, ChevronDown, CreditCard, Package } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

declare global {
  interface Window {
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

  // Accordion Steps: 1 = Address, 2 = Payment Method, 3 = Review
  const [activeStep, setActiveStep] = useState<1 | 2 | 3>(1);

  // Price calculations
  const total = getTotalPrice();
  const shippingAmount = total > 999 ? 0 : 50;
  const grandTotal = total + shippingAmount;

  useEffect(() => {
    setMounted(true);
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

  const handleAddressSubmit = () => {
    if (useNewAddress) {
      if (!formData.firstName || !formData.address || !formData.phone || !formData.city || !formData.pincode) {
        toast.error("Please fill out all required address fields.");
        return;
      }
    } else {
      if (!selectedAddressId) {
        toast.error("Please select a delivery address.");
        return;
      }
    }
    setActiveStep(2);
  };

  const handlePaymentMethodSubmit = () => {
    setActiveStep(3);
  };

  const handlePlaceOrder = async () => {
    if (!window.Razorpay) {
      toast.error("Razorpay SDK failed to load. Are you online?");
      return;
    }

    setIsProcessing(true);

    try {
      // 1. Create order on backend (Secure price calculation happens here)
      const res = await fetch("/api/checkout/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          items,
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
        description: "Secure Payment",
        order_id: order.id,
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
            router.push(`/checkout/success${verifyData.orderId ? `?orderId=${verifyData.orderId}` : ''}`);
          } else {
            toast.error("Payment verification failed. Please contact support.");
          }
        },
        prefill: {
          name: useNewAddress ? `${formData.firstName} ${formData.lastName}` : "",
          email: useNewAddress ? formData.email : "",
          contact: useNewAddress ? formData.phone : "",
        },
        theme: { color: "#2E7D32" },
      };

      const rzp1 = new window.Razorpay(options);
      rzp1.on("payment.failed", function (response: any) {
        toast.error(`Payment failed: ${response.error.description}`);
      });
      rzp1.open();

    } catch (error) {
      console.error(error);
      toast.error("Something went wrong during checkout.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) return null;

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h1 className="text-3xl font-bold mb-4">Your cart is empty</h1>
        <Button onClick={() => router.push("/shop")} className="rounded-full px-8">Continue Shopping</Button>
      </div>
    );
  }

  const selectedAddress = savedAddresses.find(a => a.id === selectedAddressId);

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      
      {/* Minimal secure header for checkout */}
      <div className="border-b bg-background sticky top-0 z-40">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="font-serif text-2xl font-bold text-primary">Captain Farmery</Link>
          <div className="flex items-center gap-2 text-2xl font-bold">
            Secure checkout <Lock className="w-5 h-5 text-muted-foreground" />
          </div>
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Accordion Steps */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* STEP 1: ADDRESS */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${activeStep === 1 ? 'border-primary shadow-sm bg-background' : 'bg-muted/30'}`}>
              <div className="flex items-center justify-between p-4 md:p-6 bg-background">
                <h2 className={`text-xl font-bold flex items-center gap-3 ${activeStep === 1 ? 'text-primary' : 'text-foreground'}`}>
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">1</span>
                  Delivery Address
                </h2>
                {activeStep > 1 && (
                  <button onClick={() => setActiveStep(1)} className="text-sm font-medium text-primary hover:underline">Change</button>
                )}
              </div>
              
              {activeStep === 1 ? (
                <div className="p-4 md:p-6 pt-0 border-t space-y-6">
                  {/* Saved Addresses List */}
                  {!useNewAddress && savedAddresses.length > 0 && (
                    <div className="space-y-3">
                      {savedAddresses.map((addr) => (
                        <div 
                          key={addr.id}
                          onClick={() => setSelectedAddressId(addr.id)}
                          className={`p-4 border-2 rounded-xl cursor-pointer transition-all flex gap-3 ${
                            selectedAddressId === addr.id 
                              ? "border-primary bg-primary/5" 
                              : "border-border hover:border-primary/30 bg-background"
                          }`}
                        >
                          <div className="mt-1">
                            <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${selectedAddressId === addr.id ? 'border-primary' : 'border-muted-foreground'}`}>
                              {selectedAddressId === addr.id && <div className="w-2.5 h-2.5 rounded-full bg-primary" />}
                            </div>
                          </div>
                          <div className="flex-1">
                            <p className="font-bold">{addr.fullName} <span className="text-xs font-normal text-muted-foreground ml-2">{addr.phone}</span></p>
                            <p className="text-sm text-muted-foreground mt-1">{addr.line1}{addr.line2 ? `, ${addr.line2}` : ''}</p>
                            <p className="text-sm text-muted-foreground">{addr.city}, {addr.state} {addr.pincode}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Add New Address Form */}
                  {(useNewAddress || savedAddresses.length === 0) && (
                    <div className="bg-background border rounded-xl p-4 md:p-6 space-y-4">
                      {savedAddresses.length > 0 && (
                        <div className="flex justify-between items-center border-b pb-4 mb-4">
                          <h3 className="font-bold">Add a new address</h3>
                          <button onClick={() => setUseNewAddress(false)} className="text-sm text-primary hover:underline">
                            Cancel
                          </button>
                        </div>
                      )}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <input required type="text" placeholder="First Name *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, firstName: e.target.value})} />
                        <input type="text" placeholder="Last Name" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, lastName: e.target.value})} />
                        <input required type="tel" placeholder="Mobile Number *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, phone: e.target.value})} />
                        <input required type="text" placeholder="Flat, House no., Building, Company, Apartment *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, address: e.target.value})} />
                        <input required type="text" placeholder="Town/City *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, city: e.target.value})} />
                        <input required type="text" placeholder="PIN Code *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" onChange={e => setFormData({...formData, pincode: e.target.value})} />
                        <input required type="text" placeholder="State *" className="border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary md:col-span-2" onChange={e => setFormData({...formData, state: e.target.value})} />
                      </div>
                    </div>
                  )}

                  {!useNewAddress && savedAddresses.length > 0 && (
                    <button onClick={() => setUseNewAddress(true)} className="flex items-center gap-2 text-sm font-medium text-primary hover:underline">
                      <Plus className="w-4 h-4" /> Add a new address
                    </button>
                  )}

                  <div className="bg-muted/30 p-4 -mx-4 md:-mx-6 -mb-6 mt-4 border-t flex justify-end">
                    <Button onClick={handleAddressSubmit} className="rounded-xl px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                      Use this address
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="px-4 md:px-6 pb-4 pt-0 text-sm pl-16">
                  {useNewAddress ? (
                    <p className="text-muted-foreground">{formData.firstName} {formData.lastName}, {formData.address}, {formData.city} {formData.pincode}</p>
                  ) : selectedAddress ? (
                    <p className="text-muted-foreground">{selectedAddress.fullName}, {selectedAddress.line1}, {selectedAddress.city} {selectedAddress.pincode}</p>
                  ) : null}
                </div>
              )}
            </div>

            {/* STEP 2: PAYMENT METHOD */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${activeStep === 2 ? 'border-primary shadow-sm bg-background' : 'bg-muted/30'}`}>
              <div className="flex items-center justify-between p-4 md:p-6 bg-background">
                <h2 className={`text-xl font-bold flex items-center gap-3 ${activeStep === 2 ? 'text-primary' : 'text-foreground'}`}>
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">2</span>
                  Payment Method
                </h2>
                {activeStep > 2 && (
                  <button onClick={() => setActiveStep(2)} className="text-sm font-medium text-primary hover:underline">Change</button>
                )}
              </div>
              
              {activeStep === 2 && (
                <div className="p-4 md:p-6 pt-0 border-t space-y-4">
                  <div className="p-4 border-2 border-primary bg-primary/5 rounded-xl cursor-pointer flex gap-3">
                    <div className="mt-1">
                      <div className="w-5 h-5 rounded-full border-2 border-primary flex items-center justify-center">
                        <div className="w-2.5 h-2.5 rounded-full bg-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-base flex items-center gap-2">
                        <CreditCard className="w-5 h-5 text-primary" /> Razorpay Secure
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">Pay via UPI, Credit/Debit Card, or Netbanking. Your payment information is encrypted and secure.</p>
                      <div className="flex gap-2 mt-3">
                        <span className="px-2 py-1 bg-white border rounded text-[10px] font-bold">UPI</span>
                        <span className="px-2 py-1 bg-white border rounded text-[10px] font-bold">VISA</span>
                        <span className="px-2 py-1 bg-white border rounded text-[10px] font-bold">MASTERCARD</span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 -mx-4 md:-mx-6 -mb-6 mt-4 border-t flex justify-end">
                    <Button onClick={handlePaymentMethodSubmit} className="rounded-xl px-8 bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm">
                      Use this payment method
                    </Button>
                  </div>
                </div>
              )}
              {activeStep === 3 && (
                <div className="px-4 md:px-6 pb-4 pt-0 text-sm pl-16">
                  <p className="text-muted-foreground font-medium flex items-center gap-2">
                    <CreditCard className="w-4 h-4" /> Razorpay (UPI, Cards, Netbanking)
                  </p>
                </div>
              )}
            </div>

            {/* STEP 3: REVIEW ITEMS */}
            <div className={`border rounded-2xl overflow-hidden transition-all ${activeStep === 3 ? 'border-primary shadow-sm bg-background' : 'bg-muted/30'}`}>
              <div className="flex items-center p-4 md:p-6 bg-background">
                <h2 className={`text-xl font-bold flex items-center gap-3 ${activeStep === 3 ? 'text-primary' : 'text-foreground'}`}>
                  <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm">3</span>
                  Items and Delivery
                </h2>
              </div>
              
              {activeStep === 3 && (
                <div className="p-4 md:p-6 pt-0 border-t space-y-6">
                  <div className="border rounded-xl p-4 bg-background">
                    <h3 className="font-bold text-green-700 mb-4 flex items-center gap-2">
                      <Package className="w-5 h-5" /> Delivery: 3-5 Business Days
                    </h3>
                    <div className="space-y-4">
                      {items.map((item: any) => (
                        <div key={item.id} className="flex gap-4 items-start pb-4 border-b last:border-0 last:pb-0">
                          <div className="w-20 h-20 bg-muted rounded-lg overflow-hidden shrink-0 relative border">
                            <Image src={item.image || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=200&auto=format&fit=crop"} alt={item.name} fill className="object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="font-bold text-base">{item.name}</p>
                            <p className="text-sm text-muted-foreground font-medium mb-2">₹{item.price.toFixed(2)}</p>
                            <div className="text-sm">
                              <span className="font-medium bg-muted px-2 py-1 rounded">Qty: {item.quantity}</span>
                              {item.variantName && <span className="ml-2 text-muted-foreground border-l pl-2">{item.variantName}</span>}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-muted/30 p-4 -mx-4 md:-mx-6 -mb-6 mt-4 border-t flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-sm text-muted-foreground max-w-sm text-center sm:text-left">
                      By placing your order, you agree to Captain Farmery's privacy notice and conditions of use.
                    </p>
                    <Button 
                      onClick={handlePlaceOrder} 
                      disabled={isProcessing}
                      className="w-full sm:w-auto rounded-xl px-12 h-12 text-base font-bold bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm"
                    >
                      {isProcessing ? "Processing Securely..." : "Place your order"}
                    </Button>
                  </div>
                </div>
              )}
            </div>
            
          </div>

          {/* Right Column: Order Summary (Sticky Sidebar) */}
          <div className="lg:col-span-4 hidden lg:block">
            <div className="bg-background border rounded-2xl p-6 sticky top-24 shadow-sm">
              <Button 
                disabled={activeStep !== 3 || isProcessing}
                onClick={activeStep === 3 ? handlePlaceOrder : undefined}
                className={`w-full rounded-xl h-11 text-sm font-bold shadow-sm mb-4 transition-all ${
                  activeStep === 3 
                    ? "bg-primary text-primary-foreground hover:bg-primary/90" 
                    : "bg-muted text-muted-foreground cursor-not-allowed"
                }`}
              >
                {activeStep === 1 ? "Use this address" : activeStep === 2 ? "Use this payment method" : isProcessing ? "Processing Securely..." : "Place your order"}
              </Button>
              
              <p className="text-xs text-center text-muted-foreground mb-4 pb-4 border-b">
                By placing your order, you agree to Captain Farmery's conditions of use.
              </p>

              <h3 className="font-bold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-2 text-sm mb-4 pb-4 border-b">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Items:</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Delivery:</span>
                  <span>{shippingAmount === 0 ? "Free" : `₹${shippingAmount.toFixed(2)}`}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Offer Processing Fee:</span>
                  <span>₹0.00</span>
                </div>
              </div>

              <div className="flex justify-between text-xl font-bold text-destructive mb-6">
                <span>Order Total:</span>
                <span>₹{grandTotal.toFixed(2)}</span>
              </div>
              
              <div className="bg-primary/5 border border-primary/20 p-3 rounded-lg flex items-start gap-2">
                <Lock className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                <p className="text-xs text-primary">
                  Secure checkout. All payments are encrypted and processed by Razorpay. We do not store your payment information.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
