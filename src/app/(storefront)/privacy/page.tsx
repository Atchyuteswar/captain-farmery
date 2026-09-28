export const metadata = {
  title: "Privacy Policy | Captain Farmery",
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Privacy Policy</h1>
        <p className="text-muted-foreground">Last updated: {new Date().toLocaleDateString()}</p>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">1. Information We Collect</h2>
          <p>
            We collect information you provide directly to us, such as when you create an account, make a purchase, or contact us for support. This may include your name, email address, phone number, shipping address, and payment information.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">2. How We Use Your Information</h2>
          <p>
            We use the information we collect to fulfill your orders, communicate with you about your account or transactions, and send you promotional materials if you have opted in. We also use data to improve our website and customer service.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with third-party service providers (such as shipping partners and payment processors) strictly for the purpose of fulfilling your order and operating our business.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">4. Data Security</h2>
          <p>
            We implement reasonable security measures to protect your personal information. However, no method of transmission over the Internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold text-foreground">5. Your Rights</h2>
          <p>
            You have the right to access, correct, or delete your personal information. You can manage your account details through the user dashboard or contact us directly for assistance.
          </p>
        </section>
      </div>
    </div>
  );
}
