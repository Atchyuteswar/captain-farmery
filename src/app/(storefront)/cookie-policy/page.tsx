export const metadata = {
  title: "Cookie Policy | Captain Farmery",
  description: "Learn about how Captain Farmery uses cookies and similar technologies on our website.",
};

export default function CookiePolicyPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-3xl">
      <div className="text-center mb-12">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4">Cookie Policy</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="prose prose-lg max-w-none space-y-8">
        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">What Are Cookies?</h2>
          <p className="text-muted-foreground leading-relaxed">
            Cookies are small text files stored on your device when you visit a website. They help the website remember your preferences, keep you signed in, and improve your browsing experience.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">How We Use Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            Captain Farmery uses cookies for the following purposes:
          </p>
          <ul className="list-disc pl-6 text-muted-foreground space-y-2 mt-2">
            <li><strong>Essential Cookies:</strong> Required for website functionality, such as authentication and cart management.</li>
            <li><strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website so we can improve the experience.</li>
            <li><strong>Preference Cookies:</strong> Remember your settings and preferences (e.g., dark mode, cookie consent).</li>
          </ul>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Third-Party Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may use trusted third-party services (such as Razorpay for payments) that set their own cookies. These cookies are governed by the respective third party&apos;s privacy and cookie policies.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Managing Cookies</h2>
          <p className="text-muted-foreground leading-relaxed">
            You can manage or disable cookies through your browser settings at any time. Please note that disabling essential cookies may affect the functionality of our website, including the checkout process.
          </p>
        </section>

        <section>
          <h2 className="font-serif text-2xl font-bold mb-3">Updates to This Policy</h2>
          <p className="text-muted-foreground leading-relaxed">
            We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated revision date.
          </p>
        </section>

        <p className="text-sm text-muted-foreground pt-4 border-t">
          Last updated: {new Date().toLocaleDateString("en-IN", { month: "long", year: "numeric" })}
        </p>
      </div>
    </div>
  );
}
