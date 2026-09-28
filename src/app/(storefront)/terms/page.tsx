export const metadata = {
  title: "Terms of Service | Captain Farmery",
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">1. Introduction</h2>
          <p>
            Welcome to Captain Farmery. By accessing our website and purchasing our products, you agree to be bound by these Terms of Service. Please read them carefully.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">2. Products and Pricing</h2>
          <p>
            All products are subject to availability. We reserve the right to limit the quantities of any products that we offer. All descriptions of products or product pricing are subject to change at any time without notice, at our sole discretion. We reserve the right to discontinue any product at any time.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">3. Shipping and Delivery</h2>
          <p>
            Delivery times are estimates and are not guaranteed. We are not responsible for delays caused by the shipping carrier or customs clearance processes. Risk of loss and title for items purchased from Captain Farmery pass to you upon our delivery to the carrier.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">4. Returns and Refunds</h2>
          <p>
            Due to the perishable nature of our products, we do not accept returns. If you receive a damaged or defective item, please contact us within 48 hours of delivery with photographic evidence, and we will issue a replacement or refund.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">5. Contact Information</h2>
          <p>
            Questions about the Terms of Service should be sent to us at support@captainfarmery.com.
          </p>
        </section>
      </div>
    </div>
  );
}
