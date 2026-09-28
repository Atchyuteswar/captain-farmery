export default function RefundPolicy() {
  return (
    <div className="container mx-auto px-4 py-24 max-w-4xl">
      <h1 className="font-serif text-4xl md:text-5xl font-bold mb-8">Refund Policy</h1>
      <p className="text-muted-foreground mb-8">Last updated: {new Date().toLocaleDateString()}</p>
      
      <div className="space-y-8 prose prose-slate max-w-none">
        <section>
          <h2 className="text-2xl font-bold mb-4">1. Return Window</h2>
          <p className="text-muted-foreground leading-relaxed">
            Due to the perishable and natural nature of our farm products, we only accept returns within 7 days of delivery for damaged or defective items.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold mb-4">2. Refund Process</h2>
          <p className="text-muted-foreground leading-relaxed">
            If your return is approved, we will initiate a refund to your original method of payment. You will receive the credit within 5-7 business days, depending on your card issuer's policies.
          </p>
        </section>
      </div>
    </div>
  );
}
