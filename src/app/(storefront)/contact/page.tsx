import { Button } from "@/components/ui/button";
import { Mail, MapPin, Phone } from "lucide-react";

export const metadata = {
  title: "Contact Us | Captain Farmery",
  description: "Get in touch with Captain Farmery for inquiries, support, and feedback.",
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Contact Us</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full mb-6"></div>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Have a question about our products, your order, or just want to say hello? We'd love to hear from you.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 max-w-6xl mx-auto">
        {/* Contact Form */}
        <div className="bg-background border rounded-3xl p-8 md:p-10 shadow-sm">
          <h2 className="text-2xl font-bold mb-6">Send us a message</h2>
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">First Name</label>
                <input type="text" className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Last Name</label>
                <input type="text" className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Email Address *</label>
              <input type="email" required className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Subject</label>
              <input type="text" className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary" />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Message *</label>
              <textarea required rows={5} className="w-full border rounded-xl px-4 py-3 bg-muted/30 focus:ring-primary focus:border-primary resize-none" />
            </div>
            <Button type="submit" className="w-full h-14 rounded-full text-lg shadow-lift">
              Send Message
            </Button>
          </form>
        </div>

        {/* Contact Information */}
        <div className="space-y-12 lg:pt-10">
          <div>
            <h2 className="text-2xl font-bold mb-8">Get in touch directly</h2>
            
            <div className="space-y-8">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Mail className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Email Us</h3>
                  <p className="text-muted-foreground mb-1">We'll respond within 24 hours.</p>
                  <a href="mailto:support@captainfarmery.com" className="text-primary font-medium hover:underline">support@captainfarmery.com</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <Phone className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Call Us</h3>
                  <p className="text-muted-foreground mb-1">Mon-Fri from 9am to 6pm IST.</p>
                  <a href="tel:+919876543210" className="text-primary font-medium hover:underline">+91 98765 43210</a>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary shrink-0">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-lg mb-1">Visit Us</h3>
                  <p className="text-muted-foreground leading-relaxed">
                    Captain Farmery HQ<br />
                    123 Green Valley Road<br />
                    Agriculture Hub, Maharashtra 411001<br />
                    India
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
