"use client";

import { useState, useEffect } from "react";
import { Search, X, Loader2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useDebounce } from "@/hooks/useDebounce";

interface SearchProduct {
  id: string;
  slug: string;
  name: string;
  basePrice: number;
  images?: { url: string }[];
}

export default function SearchBar() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchProduct[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 300);

  useEffect(() => {
    if (debouncedQuery.length >= 2) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsLoading(true);
      fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
        .then((res) => res.json())
        .then((data) => {
          setResults(data.products || []);
          setIsOpen(true);
        })
        .finally(() => setIsLoading(false));
    } else {
      setResults([]);
      setIsOpen(false);
    }
  }, [debouncedQuery]);

  return (
    <div className="relative group w-full max-w-sm">
      <label htmlFor="search-input" className="sr-only">Search products</label>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
      <input
        id="search-input"
        type="text"
        placeholder="Search products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onFocus={() => { if (results.length > 0) setIsOpen(true) }}
        className="w-full h-10 pl-10 pr-10 rounded-full bg-secondary border-none focus:outline-none focus:ring-2 focus:ring-primary/20 text-sm"
      />
      {query && (
        <button 
          onClick={() => { setQuery(""); setIsOpen(false); }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
        >
          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <X className="h-4 w-4" />}
        </button>
      )}

      {/* Autocomplete Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-background border rounded-2xl shadow-card p-2 z-50">
          <ul className="flex flex-col gap-1">
            {results.map((product) => (
              <li key={product.id}>
                <Link 
                  href={`/product/${product.slug}`}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 p-2 hover:bg-secondary rounded-xl transition-colors"
                >
                  <div className="w-10 h-10 bg-muted rounded-lg overflow-hidden shrink-0 relative">
                    <Image 
                      src={product.images?.[0]?.url || "https://images.unsplash.com/photo-1500937386664-56d1dfef3854?q=80&w=100&auto=format&fit=crop"} 
                      alt=""
                      fill
                      className="object-cover" 
                    />
                  </div>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium line-clamp-1">{product.name}</span>
                    <span className="text-xs text-muted-foreground">₹{product.basePrice}</span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
