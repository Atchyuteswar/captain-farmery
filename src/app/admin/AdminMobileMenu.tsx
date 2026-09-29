"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Image as ImageIcon,
  MessageSquare,
  HelpCircle,
  FolderTree,
  Menu,
  X,
  RotateCcw
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { signOut } from "next-auth/react";

export default function AdminMobileMenu() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <Button variant="ghost" size="icon" onClick={() => setIsOpen(true)}>
        <Menu className="w-6 h-6" />
      </Button>
    );
  }

  return (
    <>
      <div className="fixed inset-0 bg-black/50 z-40" onClick={() => setIsOpen(false)} />
      <div className="fixed top-0 right-0 h-full w-64 bg-background shadow-xl z-50 flex flex-col animate-in slide-in-from-right duration-300">
        <div className="flex items-center justify-between p-4 border-b">
          <span className="font-serif font-bold text-primary">Menu</span>
          <Button variant="ghost" size="icon" onClick={() => setIsOpen(false)}>
            <X className="w-5 h-5" />
          </Button>
        </div>
        
        <nav className="flex-1 overflow-y-auto p-4 space-y-2">
          <Link href="/admin" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <LayoutDashboard className="w-5 h-5 text-muted-foreground" /> Dashboard
          </Link>
          <Link href="/admin/orders" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <ShoppingBag className="w-5 h-5 text-muted-foreground" /> Orders
          </Link>
          <Link href="/admin/returns" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <RotateCcw className="w-5 h-5 text-muted-foreground" /> Returns
          </Link>
          <Link href="/admin/products" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <ImageIcon className="w-5 h-5 text-muted-foreground" /> Products
          </Link>
          <Link href="/admin/categories" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <FolderTree className="w-5 h-5 text-muted-foreground" /> Categories
          </Link>
          <Link href="/admin/customers" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <Users className="w-5 h-5 text-muted-foreground" /> Customers
          </Link>
          <Link href="/admin/reviews" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <MessageSquare className="w-5 h-5 text-muted-foreground" /> Reviews
          </Link>
          <Link href="/admin/faqs" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <HelpCircle className="w-5 h-5 text-muted-foreground" /> FAQs
          </Link>
          <Link href="/admin/settings" onClick={() => setIsOpen(false)} className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium">
            <Settings className="w-5 h-5 text-muted-foreground" /> Settings
          </Link>
        </nav>

        <div className="p-4 border-t">
          <Button variant="ghost" onClick={() => signOut({ callbackUrl: "/login" })} className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3">
            <LogOut className="w-5 h-5 mr-3" /> Sign Out
          </Button>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              &larr; Back to Storefront
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
