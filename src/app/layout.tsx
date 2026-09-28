import type { Metadata } from "next";
import { Inter, Playfair_Display } from "next/font/google";
import "./globals.css";
import { Toaster } from "sonner";
import { FloatingWidgets } from "@/components/layout/FloatingWidgets";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Captain Farmery | Premium Farm Products",
  description: "Pure, natural, and sustainably sourced farm products delivered to your doorstep. Experience the tradition of authentic Indian farming.",
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || "https://captain-farmery.vercel.app"),
  keywords: ["farm fresh", "organic", "spices", "honey", "d2c farm"],
  icons: {
    icon: "/favicon.ico",
  },
  openGraph: {
    title: "Captain Farmery | Premium Farm Products",
    description: "Pure, natural, and sustainably sourced farm products delivered to your doorstep.",
    url: process.env.NEXT_PUBLIC_APP_URL || "https://captain-farmery.vercel.app",
    siteName: "Captain Farmery",
    locale: "en_IN",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${playfair.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans overflow-x-hidden">
        <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 bg-primary text-white p-2 z-[9999] rounded">Skip to content</a>
        <main id="main-content" className="flex-1 flex flex-col">
          {children}
        </main>
        <FloatingWidgets />
        <Toaster position="bottom-right" richColors />
      </body>
    </html>
  );
}
