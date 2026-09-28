import Link from "next/link";
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Users, 
  Settings, 
  LogOut,
  Image as ImageIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-muted/20">
      {/* Admin Sidebar */}
      <aside className="w-64 bg-background border-r flex flex-col hidden md:flex">
        <div className="p-6 border-b">
          <Link href="/admin">
            <span className="font-serif text-2xl font-bold text-primary">Farmery Admin</span>
          </Link>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <Link 
            href="/admin" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <LayoutDashboard className="w-5 h-5 text-muted-foreground" /> Dashboard
          </Link>
          <Link 
            href="/admin/orders" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <ShoppingBag className="w-5 h-5 text-muted-foreground" /> Orders
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" /> Products
          </Link>
          <Link 
            href="/admin/customers" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <Users className="w-5 h-5 text-muted-foreground" /> Customers
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <form action="/api/auth/signout" method="POST">
            <Button variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto">
              <LogOut className="w-5 h-5 mr-3" /> Sign Out
            </Button>
          </form>
          <div className="mt-4 text-center">
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
              &larr; Back to Storefront
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-muted/20">
        <header className="h-16 bg-background border-b flex items-center justify-between px-8 md:hidden">
           <Link href="/admin">
            <span className="font-serif text-xl font-bold text-primary">Farmery Admin</span>
          </Link>
          {/* Mobile menu toggle would go here */}
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
