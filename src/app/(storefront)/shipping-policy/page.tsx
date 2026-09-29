export const metadata = {
  title: "Shipping Policy | Captain Farmery",
  description: "Learn about Captain Farmery's shipping policy, delivery timelines, and shipping charges.",
};

export default function ShippingPolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Shipping Policy</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Delivery Timelines</h2>
          <p className="text-muted-foreground leading-relaxed">
            All orders are processed within 1-2 business days after payment confirmation. Once dispatched, deliveries typically arrive within 3-5 business days depending on your location. Remote pin codes may take up to 7 business days.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Shipping Charges</h2>
          <p className="text-muted-foreground leading-relaxed">
            We offer <strong>free shipping</strong> on all orders above ₹999. For orders below ₹999, a flat delivery fee of ₹50 is charged. This helps us ensure every product reaches you safely and in perfect condition.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Tracking Your Order</h2>
          <p className="text-muted-foreground leading-relaxed">
            Once your order is shipped, you will receive a confirmation email with tracking details. You can also track your order anytime by visiting your Account → Orders page on our website.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Delivery Partners</h2>
          <p className="text-muted-foreground leading-relaxed">
            We partner with trusted logistics providers to ensure timely and safe delivery of your orders across India. All packages are carefully packed to maintain product freshness and quality during transit.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Damaged or Missing Items</h2>
          <p className="text-muted-foreground leading-relaxed">
            If your order arrives damaged or with missing items, please contact us within 48 hours of delivery with photos of the damaged package. We will arrange a replacement or full refund at no extra cost.
          </p>
        </section>

        <p className="text-sm text-muted-foreground pt-4 border-t">
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
