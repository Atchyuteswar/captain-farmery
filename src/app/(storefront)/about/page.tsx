export const metadata = {
  title: "About Us | Captain Farmery",
  description: "Learn about Captain Farmery's mission to deliver premium, pure, and sustainably sourced farm products to your doorstep.",
};

import Image from "next/image";

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-16 md:py-24 max-w-4xl">
      <div className="text-center mb-16">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
        <div className="w-24 h-1 bg-primary mx-auto rounded-full"></div>
      </div>

      <div className="prose prose-lg max-w-none text-foreground/80 space-y-8">
        <p className="text-xl leading-relaxed">
          At Captain Farmery, we believe that pure, unadulterated food is the cornerstone of a healthy life. Born from a passion for sustainable agriculture and traditional farming methods, our journey began with a simple mission: to bridge the gap between traditional Indian farms and modern dining tables.
        </p>

        <div className="my-12 w-full h-80 bg-muted rounded-3xl overflow-hidden relative">
          <Image 
            src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=1200&auto=format&fit=crop" 
            alt="Beautiful green farm landscape"
            fill
            className="object-cover"
          />
        </div>

        <h2 className="font-serif text-3xl font-bold text-foreground mt-12 mb-4">The Captain's Promise</h2>
        <p>
          We source directly from ethical farmers who share our vision for quality over quantity. Whether it's our rich, golden Gir Cow Ghee made using the traditional Bilona method, or our cold-pressed mustard oil, every product undergoes rigorous quality checks.
        </p>
        
        <ul className="list-disc pl-6 space-y-2 mt-4">
          <li><strong>100% Pure & Natural:</strong> No artificial colors, preservatives, or hidden chemicals.</li>
          <li><strong>Ethically Sourced:</strong> Fair compensation for our farming partners.</li>
          <li><strong>Traditional Methods:</strong> Preserving the wisdom of ancient Indian agricultural practices.</li>
          <li><strong>Sustainable Packaging:</strong> Minimizing our carbon footprint wherever possible.</li>
        </ul>

        <h2 className="font-serif text-3xl font-bold text-foreground mt-12 mb-4">Looking Forward</h2>
        <p>
          As we grow, our commitment to purity remains steadfast. Captain Farmery isn't just a brand; it's a movement towards mindful eating and supporting local agriculture. Thank you for joining us on this journey.
        </p>
      </div>
    </div>
  );
}
