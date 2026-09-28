"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, User, Heart, Menu, ShieldCheck, X, Moon, Sun } from "lucide-react";
import Image from "next/image";
import { Button, buttonVariants } from "@/components/ui/button";
import SearchBar from "@/components/layout/SearchBar";
import CartButton from "@/components/cart/CartButton";

export default function Header({ isAdmin = false }: { isAdmin?: boolean }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDark, setIsDark] = useState(false);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4 md:gap-8">
          {/* Mobile Menu & Logo */}
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setMobileMenuOpen(true)}>
              <Menu className="h-5 w-5" />
            </Button>
            <Link href="/" className="flex items-center gap-2">
              <Image src="/logo.png" alt="Captain Farmery" width={150} height={50} className="object-contain" />
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
            <Link href="/shop" className="hover:text-primary transition-colors">Shop</Link>
            <Link href="/category/pure-honey" className="hover:text-primary transition-colors">Honey</Link>
            <Link href="/category/spices" className="hover:text-primary transition-colors">Spices</Link>
            <Link href="/about" className="hover:text-primary transition-colors">About Us</Link>
            <Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link>
          </nav>

          {/* Search & Actions */}
          <div className="flex items-center gap-2 md:gap-4 flex-1 md:flex-none justify-end">
            <div className="hidden md:flex flex-1 max-w-sm relative">
              <SearchBar />
            </div>

            <Button variant="ghost" size="icon" className="md:hidden">
              <Search className="h-5 w-5" />
            </Button>

            {/* Dark Mode Toggle */}
            <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="hidden sm:inline-flex">
              {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
              <span className="sr-only">Toggle dark mode</span>
            </Button>
            
            <Link href="/account" className={buttonVariants({ variant: "ghost", size: "icon" })}>
              <User className="h-5 w-5" />
              <span className="sr-only">Account</span>
            </Link>

            {isAdmin && (
              <Link href="/admin" className={`${buttonVariants({ variant: "ghost", size: "icon" })} text-primary`}>
                <ShieldCheck className="h-5 w-5" />
                <span className="sr-only">Admin</span>
              </Link>
            )}

            <CartButton />
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm md:hidden" onClick={() => setMobileMenuOpen(false)} />
      )}

      {/* Mobile Menu Drawer */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-background z-[70] shadow-2xl transform transition-transform duration-300 ease-in-out md:hidden ${
          mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-serif text-xl font-bold text-primary">Captain Farmery</span>
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(false)}>
            <X className="h-5 w-5" />
          </Button>
        </div>
        <nav className="flex flex-col p-4 space-y-1">
          <Link href="/shop" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            Shop All
          </Link>
          <Link href="/category/pure-honey" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            Honey
          </Link>
          <Link href="/category/spices" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            Spices
          </Link>
          <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            About Us
          </Link>
          <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            Contact Us
          </Link>

          <div className="border-t my-4" />

          <Link href="/account" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            <User className="w-5 h-5 text-muted-foreground" /> My Account
          </Link>
          <Link href="/account/orders" onClick={() => setMobileMenuOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors">
            My Orders
          </Link>

          <div className="border-t my-4" />

          <button
            onClick={() => { toggleDarkMode(); setMobileMenuOpen(false); }}
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted font-medium transition-colors text-left w-full"
          >
            {isDark ? <Sun className="w-5 h-5 text-muted-foreground" /> : <Moon className="w-5 h-5 text-muted-foreground" />}
            {isDark ? "Light Mode" : "Dark Mode"}
          </button>
        </nav>
      </div>
    </>
  );
}
