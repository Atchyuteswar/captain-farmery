import Link from "next/link";
import Image from "next/image";
import { buttonVariants } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";

export default async function Homepage() {
  const categories = await prisma.category.findMany({
    where: { isActive: true },
    take: 3,
  });
  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[80vh] flex items-center justify-center bg-muted overflow-hidden">
        {/* Placeholder for Hero Image */}
        <div className="absolute inset-0 bg-gradient-to-b from-black/40 to-black/10 z-10" />
        <Image 
          src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2400&auto=format&fit=crop" 
          alt="Captain Farmery Farm"
          fill
          priority
          sizes="100vw"
          className="absolute inset-0 object-cover"
        />
        
        <div className="relative z-20 container mx-auto px-4 text-center text-white">
          <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 drop-shadow-lg">
            Rooted in Tradition, <br /> Driven by Purity
          </h1>
          <p className="text-lg md:text-xl max-w-2xl mx-auto mb-8 text-white/90 drop-shadow">
            Experience the finest raw honey, stone-ground spices, and organic grains delivered directly from our farms to your home.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/shop" className={`${buttonVariants({ size: "lg", variant: "default" })} text-base h-12 px-8 rounded-full shadow-lift flex items-center justify-center`}>
              Shop Now
            </Link>
            <Link href="/about" className={`${buttonVariants({ size: "lg", variant: "outline" })} text-base h-12 px-8 rounded-full bg-white/10 backdrop-blur border-white/30 text-white hover:bg-white hover:text-black shadow-lift flex items-center justify-center`}>
              Our Story
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Categories */}
      <section className="py-24 bg-bg-secondary">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-bold mb-4">Shop by Category</h2>
            <p className="text-muted-foreground">Discover our range of pure, natural products</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => (
              <Link href={`/category/${category.slug}`} key={category.id} className="aspect-[4/5] bg-background rounded-[40px] shadow-card overflow-hidden group cursor-pointer relative block">
                {category.image ? (
                  <Image src={category.image} alt={category.name} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                ) : (
                  <Image src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=600&auto=format&fit=crop" alt={category.name} fill className="object-cover opacity-50" sizes="(max-width: 768px) 100vw, 33vw" />
                )}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors z-10" />
                <div className="absolute bottom-0 left-0 right-0 p-8 z-20 bg-gradient-to-t from-black/80 to-transparent text-white translate-y-4 group-hover:translate-y-0 transition-transform">
                  <h3 className="font-serif text-2xl font-bold mb-2">{category.name}</h3>
                  <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">Explore &rarr;</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 text-center">
          <h2 className="font-serif text-3xl md:text-4xl font-bold mb-16">The Captain Farmery Difference</h2>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {["100% Pure & Natural", "Ethically Sourced", "Lab Tested", "Farm to Home"].map((benefit, i) => (
              <div key={i} className="flex flex-col items-center p-6">
                <div className="w-16 h-16 rounded-full bg-brand-50 text-primary flex items-center justify-center mb-6 text-2xl">
                  {i === 0 ? "🍯" : i === 1 ? "🌿" : i === 2 ? "🔬" : "🚚"}
                </div>
                <h4 className="font-bold text-lg mb-2">{benefit}</h4>
                <p className="text-muted-foreground text-sm">We ensure the highest quality standards at every step of the process.</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
