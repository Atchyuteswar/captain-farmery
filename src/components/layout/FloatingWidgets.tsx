"use client";

import { useState, useEffect } from "react";
import { ArrowUp, MessageCircle, X } from "lucide-react";
import Link from "next/link";

export function FloatingWidgets() {
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [showCookieBanner, setShowCookieBanner] = useState(false);

  useEffect(() => {
    // Check cookie consent
    if (!localStorage.getItem("cookie_consent")) {
      setShowCookieBanner(true);
    }

    const handleScroll = () => {
      // Scroll Progress
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const scroll = `${totalScroll / windowHeight}`;
      setScrollProgress(Number(scroll) * 100);

      // Back to Top visibility
      if (window.scrollY > 400) {
        setShowBackToTop(true);
      } else {
        setShowBackToTop(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const acceptCookies = () => {
    localStorage.setItem("cookie_consent", "true");
    setShowCookieBanner(false);
  };

  return (
    <>
      {/* Scroll Progress Bar */}
      <div 
        className="fixed top-0 left-0 h-1 bg-primary z-[100] transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      {/* Floating Buttons */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-3">
        {/* Contact/WhatsApp */}
        <Link 
          href="/contact" 
          className="w-12 h-12 bg-green-600 text-white rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"
          aria-label="Contact Us"
        >
          <MessageCircle className="w-6 h-6" />
        </Link>
        
        {/* Back to Top */}
        {showBackToTop && (
          <button 
            onClick={scrollToTop}
            className="w-12 h-12 bg-secondary text-secondary-foreground border rounded-full flex items-center justify-center shadow-lg hover:-translate-y-1 transition-transform"
            aria-label="Back to top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Cookie Consent Banner */}
      {showCookieBanner && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-background border-t shadow-[0_-10px_40px_rgba(0,0,0,0.1)] z-[100] flex flex-col sm:flex-row items-center justify-between gap-4 animate-in slide-in-from-bottom-10">
          <div className="flex-1 text-sm text-muted-foreground">
            <p>
              We use cookies to improve your experience, analyze site traffic, and serve tailored advertisements. 
              By continuing to browse this site, you consent to our <Link href="/privacy" className="text-primary underline">Privacy Policy</Link> and <Link href="/cookie-policy" className="text-primary underline">Cookie Policy</Link>.
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={acceptCookies} 
              className="px-6 py-2 bg-primary text-primary-foreground font-medium rounded-full hover:bg-primary/90 transition-colors"
            >
              Accept All
            </button>
            <button 
              onClick={() => setShowCookieBanner(false)} 
              className="p-2 text-muted-foreground hover:text-foreground"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>
      )}
    </>
  );
}
