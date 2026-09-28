"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { X } from "lucide-react";

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const hasConsented = localStorage.getItem("cookie-consent");
    if (!hasConsented) {
      setIsVisible(true);
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem("cookie-consent", "true");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 animate-in slide-in-from-bottom-10 fade-in duration-500">
      <div className="max-w-4xl mx-auto bg-background border border-border shadow-2xl rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative">
        <button 
          onClick={() => setIsVisible(false)}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground md:hidden"
        >
          <X className="w-5 h-5" />
        </button>
        <div className="flex-1 pr-6 md:pr-0">
          <h3 className="font-semibold text-lg mb-1">Cookie Consent</h3>
          <p className="text-sm text-muted-foreground">
            We use cookies to enhance your browsing experience, serve personalized ads or content, and analyze our traffic. By clicking "Accept All", you consent to our use of cookies. <Link href="/cookie-policy" className="underline text-primary hover:text-primary/80">Read our Cookie Policy</Link>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <Button variant="outline" className="rounded-full whitespace-nowrap" onClick={() => setIsVisible(false)}>
            Decline
          </Button>
          <Button className="rounded-full whitespace-nowrap" onClick={acceptCookies}>
            Accept All
          </Button>
        </div>
      </div>
    </div>
  );
}
