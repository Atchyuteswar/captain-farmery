"use client";

import { useState, useEffect } from "react";
import { ChevronUp } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener("scroll", toggleVisibility);
    return () => window.removeEventListener("scroll", toggleVisibility);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth"
    });
  };

  if (!isVisible) return null;

  return (
    <Button
      variant="default"
      size="icon"
      onClick={scrollToTop}
      className="fixed bottom-6 right-6 z-40 rounded-full shadow-xl w-12 h-12 bg-primary hover:bg-primary/90 text-primary-foreground animate-in zoom-in fade-in duration-300 transition-all hover:scale-110"
      aria-label="Back to top"
    >
      <ChevronUp className="w-6 h-6" />
    </Button>
  );
}
