"use client";

import { useState } from "react";

import { Star, CheckCircle2, UserCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";

interface Review {
  id: string;
  rating: number;
  title: string | null;
  body: string;
  isVerifiedPurchase: boolean;
  createdAt: Date;
  user: {
    name: string | null;
  };
}

export default function ReviewSection({ productId, initialReviews, session }: { productId: string, initialReviews: any[], session: any }) {
  const [reviews, setReviews] = useState<Review[]>(initialReviews);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  
  const [formData, setFormData] = useState({
    rating: 5,
    title: "",
    content: ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast.error("Please login to submit a review");
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch("/api/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, productId })
      });
      
      const data = await res.json();
      
      if (data.error) throw new Error(data.error);

      // Optimistically add to list
      setReviews([{
        ...data.review,
        user: { name: session.user?.name || "You" },
        createdAt: new Date()
      }, ...reviews]);
      
      toast.success("Review submitted successfully!");
      setShowForm(false);
      setFormData({ rating: 5, title: "", content: "" });
    } catch (error: any) {
      toast.error(error.message || "Failed to submit review");
    } finally {
      setIsSubmitting(false);
    }
  };

  const averageRating = reviews.length > 0 
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="py-12 border-t mt-16">
      <div className="flex flex-col md:flex-row gap-12">
        
        {/* Left Side: Summary & Form */}
        <div className="md:w-1/3">
          <h2 className="font-serif text-3xl font-bold mb-6">Customer Reviews</h2>
          
          <div className="flex items-center gap-4 mb-6">
            <div className="text-5xl font-bold">{averageRating}</div>
            <div>
              <div className="flex text-yellow-500 mb-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className={`w-5 h-5 ${star <= Number(averageRating) ? "fill-yellow-500" : "fill-muted text-muted"}`} />
                ))}
              </div>
              <p className="text-sm text-muted-foreground">{reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}</p>
            </div>
          </div>

          {!showForm ? (
            <div className="space-y-4">
              <h3 className="font-bold">Share your thoughts</h3>
              <p className="text-sm text-muted-foreground mb-4">If you've used this product, share your thoughts with other customers.</p>
              {session ? (
                <Button onClick={() => setShowForm(true)} className="w-full rounded-full h-12 shadow-sm">Write a Review</Button>
              ) : (
                <Link href="/login" className="w-full h-12 flex items-center justify-center border-2 border-primary text-primary rounded-full font-medium hover:bg-primary/5 transition-colors">
                  Login to write a review
                </Link>
              )}
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="bg-muted/30 p-6 rounded-3xl border space-y-4">
              <h3 className="font-bold mb-2">Write a Review</h3>
              
              <div>
                <label className="text-sm font-medium block mb-2">Rating</label>
                <div className="flex gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button 
                      key={star} 
                      type="button"
                      onClick={() => setFormData({...formData, rating: star})}
                    >
                      <Star className={`w-8 h-8 ${star <= formData.rating ? "fill-yellow-500 text-yellow-500" : "fill-muted text-muted hover:fill-yellow-200"}`} />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Title (Optional)</label>
                <input 
                  type="text" 
                  placeholder="Summarize your experience"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-primary focus:border-primary"
                  value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})}
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Review *</label>
                <textarea 
                  required
                  rows={4}
                  placeholder="What did you like or dislike?"
                  className="w-full border rounded-xl px-4 py-3 focus:ring-primary focus:border-primary resize-none"
                  value={formData.content}
                  onChange={e => setFormData({...formData, content: e.target.value})}
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowForm(false)} className="flex-1 rounded-xl">Cancel</Button>
                <Button type="submit" disabled={isSubmitting} className="flex-1 rounded-xl shadow-sm">
                  {isSubmitting ? "Submitting..." : "Submit Review"}
                </Button>
              </div>
            </form>
          )}
        </div>

        {/* Right Side: Review List */}
        <div className="md:w-2/3">
          {reviews.length === 0 ? (
            <div className="bg-muted/30 p-12 rounded-3xl text-center border h-full flex flex-col items-center justify-center">
              <Star className="w-12 h-12 text-muted-foreground mb-4 opacity-50" />
              <h3 className="font-bold text-lg mb-2">No reviews yet</h3>
              <p className="text-muted-foreground">Be the first to review this product!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="border-b pb-6 last:border-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                        <UserCircle2 className="w-6 h-6 text-muted-foreground" />
                      </div>
                      <div>
                        <p className="font-bold text-sm">{review.user.name || "Anonymous Customer"}</p>
                        <p className="text-xs text-muted-foreground">{new Date(review.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                      </div>
                    </div>
                    {review.isVerifiedPurchase && (
                      <span className="flex items-center gap-1 text-xs font-bold text-green-700 bg-green-50 border border-green-200 px-2 py-1 rounded-full">
                        <CheckCircle2 className="w-3 h-3" /> Verified Purchase
                      </span>
                    )}
                  </div>
                  
                  <div className="flex text-yellow-500 mb-3 ml-[52px]">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star key={star} className={`w-4 h-4 ${star <= review.rating ? "fill-yellow-500" : "fill-muted text-muted"}`} />
                    ))}
                  </div>
                  
                  <div className="ml-[52px]">
                    {review.title && <h4 className="font-bold mb-2">{review.title}</h4>}
                    <p className="text-muted-foreground text-sm leading-relaxed whitespace-pre-wrap">{review.body}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
