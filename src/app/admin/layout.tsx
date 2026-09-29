import Link from "next/link";
import { signOut } from "@/auth";
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
import AdminMobileMenu from "./AdminMobileMenu";

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
            href="/admin/returns" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <RotateCcw className="w-5 h-5 text-muted-foreground" /> Returns
          </Link>
          <Link 
            href="/admin/products" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <ImageIcon className="w-5 h-5 text-muted-foreground" /> Products
          </Link>
          <Link 
            href="/admin/categories" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <FolderTree className="w-5 h-5 text-muted-foreground" /> Categories
          </Link>
          <Link 
            href="/admin/customers" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <Users className="w-5 h-5 text-muted-foreground" /> Customers
          </Link>
          <Link 
            href="/admin/reviews" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <MessageSquare className="w-5 h-5 text-muted-foreground" /> Reviews
          </Link>
          <Link 
            href="/admin/faqs" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <HelpCircle className="w-5 h-5 text-muted-foreground" /> FAQs
          </Link>
          <Link 
            href="/admin/settings" 
            className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-muted text-foreground font-medium transition-colors"
          >
            <Settings className="w-5 h-5 text-muted-foreground" /> Settings
          </Link>
        </nav>
        
        <div className="p-4 border-t">
          <form action={async () => {
            "use server";
            await signOut({ redirectTo: "/login" });
          }}>
            <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto">
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
      <main className="flex-1 overflow-y-auto bg-muted/20 w-full overflow-x-hidden">
        <header className="h-16 bg-background border-b flex items-center justify-between px-4 md:hidden sticky top-0 z-50">
           <Link href="/admin">
            <span className="font-serif text-xl font-bold text-primary">Farmery Admin</span>
          </Link>
          <AdminMobileMenu />
        </header>
        <div className="p-4 md:p-8 overflow-x-hidden">
          {children}
        </div>
      </main>
    </div>
  );
}
