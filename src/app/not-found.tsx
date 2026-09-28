import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center py-24 px-4 text-center min-h-[70vh]">
      <h1 className="font-serif text-8xl md:text-9xl font-bold text-primary mb-6">404</h1>
      <h2 className="text-2xl md:text-3xl font-bold mb-4">Page Not Found</h2>
      <p className="text-muted-foreground mb-8 max-w-md mx-auto">
        We couldn't find the page you were looking for. It might have been moved, deleted, or perhaps never existed.
      </p>
      <div className="flex gap-4 flex-col sm:flex-row">
        <Button asChild size="lg" className="rounded-full">
          <Link href="/">Return Home</Link>
        </Button>
        <Button asChild variant="outline" size="lg" className="rounded-full">
          <Link href="/shop">Browse Shop</Link>
        </Button>
      </div>
    </div>
  );
}
