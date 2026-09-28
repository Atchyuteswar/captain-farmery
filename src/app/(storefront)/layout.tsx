import AnnouncementBar from "@/components/layout/AnnouncementBar";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import CartDrawer from "@/components/cart/CartDrawer";
import PageTransition from "@/components/layout/PageTransition";
import { auth } from "@/auth";

export default async function StorefrontLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  const isAdmin = session?.user?.role === "ADMIN";

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <Header isAdmin={isAdmin} />
      <PageTransition>
        <main className="flex-1 w-full">
          {children}
        </main>
      </PageTransition>
      <Footer />
      <CartDrawer />
    </div>
  );
}
