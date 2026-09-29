import React from 'react';
import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Leaf, ShieldCheck, Truck, Droplets, CheckCircle2, Package, ThermometerSnowflake, Home, Mail, Phone, MapPin, Star } from 'lucide-react';
import FAQItem from "@/components/ui/FAQItem";
import ProductCard from "@/components/product/ProductCard";

export default async function Homepage({
  searchParams,
}: {
  searchParams: { category?: string }
}) {
  const categoryFilter = await searchParams?.category;

  const categories = await prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: "asc" }
  });

  const products = await prisma.product.findMany({
    where: {
      status: "ACTIVE",
      ...(categoryFilter ? { category: { slug: categoryFilter } } : {})
    },
    include: { variants: true, images: true }
  });

  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    include: { user: true },
    take: 10,
    orderBy: { createdAt: "desc" }
  });

  let faqs: any[] = [];
  // @ts-ignore
  if (prisma.fAQ) {
    // @ts-ignore
    faqs = await prisma.fAQ.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });
  }

  // Fetch CMS Models
  // @ts-ignore
  let banners: any[] = [];
  // @ts-ignore
  if (prisma.banner) {
    // @ts-ignore
    banners = await prisma.banner.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });
  }

  // @ts-ignore
  let sections: any[] = [];
  // @ts-ignore
  if (prisma.homepageSection) {
    // @ts-ignore
    sections = await prisma.homepageSection.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: "asc" }
    });
  }
  
  // Fallback reviews if empty to match the design aesthetics
  const displayReviews = reviews.length > 0 ? reviews : [
    { text: "Vana Makarandam Honey is unlike anything I've bought in stores. You can taste the natural floral richness clearly. Truly raw and pure.", user: { name: "Ananya Sharma" }, role: "Nutritional" },
    { text: "The aroma and texture of Vana Makarandam Honey are exceptional. It enhances desserts and herbal drinks beautifully.", user: { name: "Rajesh Verma" }, role: "Chef" },
    { text: "Finally found a honey I trust for my kids. Thick, natural, and no artificial sweetness at all.", user: { name: "Sneha Patel" }, role: "Home Maker" },
    { text: "I use Vana Makarandam Honey daily in my morning routine. Pure energy and great taste.", user: { name: "Arjun Reddy" }, role: "Fitness Trainer" },
    { text: "The consistency and purity are impressive. You can tell it's unprocessed honey.", user: { name: "Meera Nair" }, role: "Diet Consultant" }
  ];

  // Extract Hero Banner
  const heroBanner = banners.find(b => b.position === 'HERO');
  const heroTitle = heroBanner?.title || `Pure nature, <br /><span class="italic text-[#2E7D32]">delivered fresh.</span>`;
  const heroImage = heroBanner?.image || "/honey_high_res.png";
  const heroLink = heroBanner?.link || "#store";

  return (
    <div className="min-h-screen bg-[#FAFAF7] font-sans text-[#111111] selection:bg-[#2E7D32]/20 selection:text-[#111111] overflow-x-hidden">
      <main id="home">
        {/* HERO SECTION */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-12 px-6 overflow-hidden bg-gradient-to-br from-[#FAFAF7] to-[#F5F5F0]">
          <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#A5D6A7]/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#FFEB00]/10 rounded-full blur-[80px] translate-y-1/3 -translate-x-1/3"></div>

          <div className="container mx-auto max-w-[1280px] relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8 animate-in fade-in slide-in-from-bottom-8 duration-1000">
              <h1 
                className="text-5xl md:text-7xl font-serif font-semibold leading-[1.1] text-[#111111]"
                dangerouslySetInnerHTML={{ __html: heroTitle }}
              />
              <p className="text-lg md:text-xl text-[#666666] font-light max-w-lg leading-relaxed">
                Experience Raw, Wild and Uncompromised quality, ethically sourced and brought straight to your table. No compromises, just real food.
              </p>
              <div className="flex flex-wrap gap-4 pt-4">
                <a href={heroLink} className="bg-[#2E7D32] text-white px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#1B5E20] transition-colors shadow-lg shadow-[#2E7D32]/20">
                  Explore Products <ArrowRight size={18} />
                </a>
                <a href={`https://wa.me/+917702850277?text=Hi, I want to order`} target="_blank" rel="noopener noreferrer" className="bg-white text-[#111111] px-8 py-4 rounded-full font-semibold flex items-center gap-2 hover:bg-[#F5F5F0] transition-colors border border-black/5 shadow-sm">
                  WhatsApp Order
                </a>
              </div>
            </div>

            <div className="relative w-full h-[60vh] lg:h-[80vh] flex justify-center items-center animate-in fade-in zoom-in-95 duration-1000 delay-200">
              <div className="relative w-full max-w-lg h-full rounded-[40px] overflow-hidden shadow-2xl">
                <Image src={heroImage} alt="Hero Image" fill priority className="object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent"></div>
              </div>
              
              <div className="absolute left-2 md:-left-6 top-6 md:top-1/4 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-2 md:gap-3 z-20">
                <div className="bg-[#E8F5E9] p-2 rounded-full text-[#2E7D32]"><Leaf size={20} /></div>
                <div>
                  <div className="text-sm font-bold">Uncompromised Quality</div>
                  <div className="text-xs text-[#666666]">Farm Fresh</div>
                </div>
              </div>

              <div className="absolute right-2 md:-right-6 bottom-6 md:bottom-1/4 bg-white/90 backdrop-blur-md p-3 md:p-4 rounded-2xl shadow-xl border border-black/5 flex items-center gap-2 md:gap-3 z-20">
                <div className="bg-[#E3F2FD] p-2 rounded-full text-[#1976D2]"><ShieldCheck size={20} /></div>
                <div>
                  <div className="text-sm font-bold">Lab Tested</div>
                  <div className="text-xs text-[#666666]">Certified Pure</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* TRUST BANNER */}
        <section className="py-8 bg-white border-y border-black/5">
          <div className="container mx-auto px-6 max-w-[1280px]">
            <div className="flex flex-wrap justify-center md:justify-between items-center gap-8">
              {[
                { icon: Truck, text: "Delivered Fresh Daily" },
                { icon: ShieldCheck, text: "Quality Guaranteed" },
                { icon: Leaf, text: "100% Natural Ingredients" },
                { icon: CheckCircle2, text: "Ethically Sourced" }
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 text-[#111111]">
                  <item.icon size={20} className="text-[#2E7D32]" />
                  <span className="text-sm font-medium tracking-wide">{item.text}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* PRODUCTS SECTION */}
        <section id="store" className="py-32 px-6">
          <div className="container mx-auto max-w-[1280px]">
            <div className="text-center mb-16 space-y-4">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold">Our Collection</h2>
              <p className="text-[#666666] max-w-2xl mx-auto">Discover our range of premium, farm-fresh products curated for your well-being.</p>
            </div>

            {/* Categories */}
            <div className="flex justify-center flex-wrap gap-3 mb-16">
              <Link
                href="/?#store"
                className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                  !categoryFilter ? "bg-[#111111] text-white shadow-lg" : "bg-white text-[#666666] border border-black/10 hover:border-[#111111]"
                }`}
              >
                All Products
              </Link>
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/?category=${cat.slug}#store`}
                  className={`px-6 py-2.5 rounded-full text-sm font-medium transition-all ${
                    categoryFilter === cat.slug ? "bg-[#111111] text-white shadow-lg" : "bg-white text-[#666666] border border-black/10 hover:border-[#111111]"
                  }`}
                >
                  {cat.name}
                </Link>
              ))}
            </div>

            {/* Product Grid */}
            {products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {products.map((product) => (
                  <ProductCard 
                    key={product.id} 
                    id={product.id}
                    slug={product.slug}
                    name={product.name}
                    shortDescription={product.shortDescription}
                    basePrice={product.basePrice}
                    compareAtPrice={product.compareAtPrice}
                    imageUrl={product.images?.[0]?.url}
                    isNew={product.isNew}
                    isBestSeller={product.isBestSeller}
                  />
                ))}
              </div>
            ) : (
              <div className="py-32 flex flex-col items-center justify-center text-center">
                <Package size={48} className="text-[#2E7D32]/30 mb-6" />
                <h3 className="text-2xl font-serif mb-2">No products found</h3>
                <p className="text-[#666666]">We couldn't find anything in this category right now.</p>
              </div>
            )}
          </div>
        </section>
        
        {/* WHY CHOOSE US - MODERN CARDS */}
        <section id="why-us" className="py-32 px-6 bg-white text-[#111111] overflow-hidden relative">
          <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#2E7D32]/5 rounded-full blur-[120px]"></div>
          <div className="container mx-auto max-w-[1280px] relative z-10">
            <div className="mb-20 md:w-1/2">
              <h2 className="text-4xl md:text-6xl font-serif font-semibold mb-6">Redefining purity.</h2>
              <p className="text-[#666666] text-lg leading-relaxed">
                We don't just sell food; we nurture a transparent ecosystem where every product tells a story of authenticity and care.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                { title: "Farm to Home", desc: "No middlemen. Just direct sourcing from our ethical farming partners to ensure peak freshness.", icon: Home, img: "/farmerATWork.jpeg" },
                { title: "Raw & Wild", desc: "Sourced directly from nature with uncompromised quality, preserving the earth's natural balance.", icon: Leaf, img: "/raw&wild.png" },
                { title: "Quality Checked", desc: "Rigorous testing protocols ensure that only the highest grade produce reaches your kitchen.", icon: ShieldCheck, img: "/skpHoney.jpeg" }
              ].map((item, i) => (
                <div key={i} className="group relative rounded-[32px] overflow-hidden bg-black text-white border border-black/10 aspect-4/5 shadow-lg">
                  <Image src={item.img} alt={item.title} fill className="object-cover opacity-80 group-hover:opacity-100 group-hover:scale-105 transition-all duration-700" sizes="(max-width: 768px) 100vw, 33vw" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 w-full p-8 z-10">
                    <div className="bg-white/20 backdrop-blur-md w-12 h-12 rounded-full flex items-center justify-center mb-6 text-white border border-white/20">
                      <item.icon size={24} />
                    </div>
                    <h3 className="text-2xl font-serif font-medium mb-3">{item.title}</h3>
                    <p className="text-white/70 text-sm leading-relaxed">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* OUR STORY - SPLIT LAYOUT */}
        <section id="about" className="py-32 px-6">
          <div className="container mx-auto max-w-[1280px]">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
              <div className="relative">
                <div className="aspect-3/4 rounded-[40px] overflow-hidden shadow-2xl relative">
                  <Image src="https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=2070" alt="Our Farm Story" fill className="object-cover" />
                </div>
                <div className="absolute -bottom-10 -right-10 bg-white p-8 rounded-[32px] shadow-xl max-w-xs border border-black/5 hidden md:block">
                  <div className="text-5xl font-serif text-[#2E7D32] mb-2">"</div>
                  <p className="text-lg font-serif font-medium leading-snug">We set out to bring real food back to the modern table.</p>
                  <p className="text-sm text-[#666666] mt-4 font-medium">— Founders, Captain Farmery</p>
                </div>
              </div>

              <div className="space-y-8">
                <h2 className="text-4xl md:text-5xl font-serif font-semibold leading-tight">Rooted in tradition, <br/> driven by purity.</h2>
                <div className="w-16 h-1 bg-[#2E7D32] rounded-full"></div>
                <p className="text-lg text-[#666666] leading-relaxed">
                  Captain Farmery was born from a simple desire to bridge the gap between rural farmers and urban families seeking authentic, unprocessed food.
                </p>
                <p className="text-lg text-[#666666] leading-relaxed">
                  Every product we offer is a testament to our core values of integrity and sustainability. We work hand-in-hand with local farming communities, ensuring fair trade while nurturing the soil for future generations.
                </p>
                
                <div className="grid grid-cols-2 gap-8 pt-8 border-t border-black/5">
                  <div>
                    <div className="text-4xl font-serif text-[#111111] mb-2">10+</div>
                    <div className="text-sm text-[#666666] uppercase tracking-wide font-semibold">Farming Partners</div>
                  </div>
                  <div>
                    <div className="text-4xl font-serif text-[#111111] mb-2">100%</div>
                    <div className="text-sm text-[#666666] uppercase tracking-wide font-semibold">Natural Promise</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* PROCESS SECTION */}
        <section className="py-32 bg-white px-6">
          <div className="container mx-auto max-w-[1280px]">
            <div className="text-center mb-24">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">The Journey</h2>
              <p className="text-muted-foreground">From our soil to your soul.</p>
            </div>

            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-[1px] bg-black/10 -translate-y-1/2 hidden md:block"></div>
              
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
                {[
                  { icon: Home, title: "The Farm", desc: "Grown with care" },
                  { icon: ShieldCheck, title: "Quality Check", desc: "Rigorous testing" },
                  { icon: Package, title: "Packaging", desc: "Eco-friendly" },
                  { icon: ThermometerSnowflake, title: "Storage", desc: "Temperature controlled" },
                  { icon: Truck, title: "Delivery", desc: "Fresh to your door" }
                ].map((step, idx) => (
                  <div key={idx} className="flex flex-col items-center text-center group">
                    <div className="w-20 h-20 bg-white border border-black/10 rounded-full flex items-center justify-center mb-6 shadow-sm group-hover:scale-110 group-hover:border-[#2E7D32] transition-all duration-300 relative z-10">
                      <step.icon size={28} className="text-[#2E7D32]" />
                    </div>
                    <h4 className="font-serif text-xl font-medium mb-2">{step.title}</h4>
                    <p className="text-sm text-[#666666]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* GALLERY SECTION (Pinterest Style) */}
        <section className="py-16 px-6 overflow-hidden">
          <div className="container mx-auto max-w-[1280px]">
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              <img src="/farmerATWork.jpeg" alt="Farmer" className="w-full rounded-[24px] shadow-sm hover:shadow-xl transition-shadow object-cover" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=2074" alt="Harvest" className="w-full rounded-[24px] shadow-sm hover:shadow-xl transition-shadow object-cover" loading="lazy" />
              <img src="https://images.unsplash.com/photo-1500382017468-9049fed747ef?q=80&w=2070" alt="Fields" className="w-full rounded-[24px] shadow-sm hover:shadow-xl transition-shadow object-cover" loading="lazy" />
              <img src="/skpHoney.jpeg" alt="SKP Honey" className="w-full rounded-[24px] shadow-sm hover:shadow-xl transition-shadow object-cover" loading="lazy" />
            </div>
          </div>
        </section>

        {/* TESTIMONIALS */}
        <section className="py-32 px-6 bg-[#F5F5F0] overflow-hidden">
          <div className="container mx-auto max-w-[1280px]">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Words of Trust</h2>
            </div>
            
            <div className="relative">
              <div className={`flex gap-6 py-4 ${displayReviews.length > 3 ? "w-max animate-marquee hover:[animation-play-state:paused]" : "flex-wrap justify-center"}`}>
                {[...Array(displayReviews.length > 3 ? 2 : 1)].map((_, loopIndex) => (
                  <React.Fragment key={loopIndex}>
                    {displayReviews.map((review: any, i: number) => (
                      <div key={`${loopIndex}-${i}`} className="w-[320px] md:w-[400px] bg-white p-10 rounded-[32px] shadow-sm border border-black/5 shrink-0 flex flex-col justify-between">
                        <div>
                          <div className="flex gap-1 mb-6 text-[#F59E0B]">
                            {[...Array(5)].map((_, i) => <Star key={i} size={16} fill="currentColor" />)}
                          </div>
                          <p className="text-lg font-serif italic text-[#111111] mb-8 leading-relaxed">"{review.text || review.body}"</p>
                        </div>

                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-[#2E7D32] rounded-full flex items-center justify-center text-white font-bold text-lg shadow-sm">
                            {(review.user?.name || "A")[0]}
                          </div>
                          <div>
                            <div className="font-semibold text-sm">{review.user?.name || "Anonymous"}</div>
                            <div className="text-xs text-[#666666]">{review.role || "Verified Customer"}</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </React.Fragment>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ SECTION */}
        <section className="py-32 px-6 bg-white">
          <div className="container mx-auto max-w-3xl">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-serif font-semibold">Common Questions</h2>
            </div>
            
            <div className="space-y-2">
              {faqs.length > 0 ? (
                faqs.map((faq: any) => (
                  <FAQItem key={faq.id} question={faq.question} answer={faq.answer} />
                ))
              ) : (
                <>
                  <FAQItem question="What is your quality guarantee?" answer="We offer Raw, Wild and Uncompromised quality. We strictly source from trusted farms, ensuring every product undergoes rigorous quality checks." />
                  <FAQItem question="How long does delivery take?" answer="We offer next-day delivery for orders placed before 8 PM in select areas to ensure maximum freshness." />
                  <FAQItem question="Do you use preservatives?" answer="Absolutely not. Our philosophy is rooted in providing pure, unadulterated food exactly as nature intended." />
                  <FAQItem question="Where are your farms located?" answer="We partner with traditional farmers across pristine rural regions, carefully selected for their rich soil and ethical farming practices." />
                </>
              )}
            </div>
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section id="contact" className="py-32 px-6 bg-[#FAFAF7]">
          <div className="container mx-auto max-w-[1280px]">
            <div className="bg-white rounded-[40px] overflow-hidden shadow-2xl border border-black/5 flex flex-col lg:flex-row">
              
              {/* Map/Info Panel */}
              <div className="lg:w-5/12 bg-[#111111] text-white p-12 md:p-16 relative overflow-hidden flex flex-col justify-between">
                <div className="absolute top-0 right-0 w-64 h-64 bg-[#2E7D32]/30 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/3"></div>
                
                <div className="relative z-10">
                  <h2 className="text-4xl font-serif mb-4">Get in touch.</h2>
                  <p className="text-white/70 mb-12 text-lg">We'd love to hear from you. Drop us a message.</p>

                  <div className="space-y-8">
                    <div className="flex items-start gap-4 group">
                      <div className="bg-white/10 p-3 rounded-full group-hover:bg-[#2E7D32] transition-colors"><Mail size={20} /></div>
                      <div>
                        <div className="text-sm text-white/50 mb-1">Email us at</div>
                        <a href="mailto:support@srikalpavriksha.com" className="text-lg font-medium">support@srikalpavriksha.com</a>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4 group">
                      <div className="bg-white/10 p-3 rounded-full group-hover:bg-[#2E7D32] transition-colors"><Phone size={20} /></div>
                      <div>
                        <div className="text-sm text-white/50 mb-1">Call us at</div>
                        <a href="tel:+917799693933" className="text-lg font-medium">+91 7799693933</a>
                      </div>
                    </div>

                    <div className="flex items-start gap-4 group">
                      <div className="bg-white/10 p-3 rounded-full group-hover:bg-[#2E7D32] transition-colors"><MapPin size={20} /></div>
                      <div>
                        <div className="text-sm text-white/50 mb-1">Place of business</div>
                        <p className="text-lg font-medium max-w-[250px] leading-snug">G1, Green Blossoms, Golden Mile Road, Kokapet, Hyderabad -500075</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Form Panel */}
              <div className="lg:w-7/12 p-12 md:p-16">
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">Full Name</label>
                      <input name="name" className="w-full bg-transparent border-b-2 border-black/10 py-3 focus:outline-none focus:border-[#2E7D32] transition-colors font-medium text-lg placeholder-black/20" placeholder="John Doe" />
                    </div>
                    
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">Email Address</label>
                      <input name="email" type="email" className="w-full bg-transparent border-b-2 border-black/10 py-3 focus:outline-none focus:border-[#2E7D32] transition-colors font-medium text-lg placeholder-black/20" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">Division</label>
                      <select name="division" className="w-full bg-transparent border-b-2 border-black/10 py-3 focus:outline-none focus:border-[#2E7D32] transition-colors font-medium text-lg text-[#111111]">
                        <option value="General">General Inquiry</option>
                        <option value="Feedback">Feedback</option>
                        <option value="Delivery">Delivery Support</option>
                      </select>
                    </div>
                    
                    <div className="relative">
                      <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">Phone Number</label>
                      <input name="phone" type="tel" className="w-full bg-transparent border-b-2 border-black/10 py-3 focus:outline-none focus:border-[#2E7D32] transition-colors font-medium text-lg placeholder-black/20" placeholder="+91 00000 00000" />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="block text-xs font-bold uppercase tracking-wider text-[#666666] mb-2">Message</label>
                    <textarea name="message" rows={4} className="w-full bg-transparent border-b-2 border-black/10 py-3 focus:outline-none focus:border-[#2E7D32] transition-colors font-medium text-lg placeholder-black/20 resize-none" placeholder="How can we help you?" />
                  </div>

                  <button type="button" className="w-full bg-[#111111] text-white py-5 rounded-full font-bold uppercase tracking-widest text-sm shadow-xl hover:bg-[#2E7D32] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300">
                    Send Message
                  </button>
                </form>
              </div>
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}
