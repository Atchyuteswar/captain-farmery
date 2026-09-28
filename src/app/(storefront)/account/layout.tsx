import Link from "next/link";
import { User, Package, MapPin, LogOut } from "lucide-react";
import { auth, signOut } from "@/auth";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="container mx-auto px-4 py-12 md:py-24">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        
        {/* Sidebar */}
        <aside className="lg:col-span-1">
          <div className="bg-secondary/30 rounded-3xl p-6 sticky top-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-xl uppercase">
                {session.user.name?.[0] || session.user.email?.[0] || "U"}
              </div>
              <div>
                <h3 className="font-bold text-lg leading-tight line-clamp-1">{session.user.name}</h3>
                <p className="text-sm text-muted-foreground line-clamp-1">{session.user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <Link 
                href="/account" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white transition-colors text-foreground font-medium"
              >
                <User className="w-5 h-5 text-muted-foreground" /> Profile
              </Link>
              <Link 
                href="/account/orders" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white transition-colors text-foreground font-medium"
              >
                <Package className="w-5 h-5 text-muted-foreground" /> Orders
              </Link>
              <Link 
                href="/account/addresses" 
                className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-white transition-colors text-foreground font-medium"
              >
                <MapPin className="w-5 h-5 text-muted-foreground" /> Addresses
              </Link>
              
              <div className="pt-4 mt-4 border-t border-border">
                <form action={async () => {
                  "use server";
                  await signOut({ redirectTo: "/" });
                }}>
                  <Button type="submit" variant="ghost" className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 px-4 py-3 h-auto">
                    <LogOut className="w-5 h-5 mr-3" /> Sign Out
                  </Button>
                </form>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content Content */}
        <main className="lg:col-span-3">
          {children}
        </main>
        
      </div>
    </div>
  );
}
