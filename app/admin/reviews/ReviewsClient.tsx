'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Star, MessageSquare, Trash2, Loader2, Search } from 'lucide-react';
import { getReviews, deleteReview } from '@/app/actions/reviews';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

function StarRating({ rating }: { rating: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {[1, 2, 3, 4, 5].map((s) => (
        <Star key={s} className={`h-3.5 w-3.5 ${s <= rating ? 'text-amber-400 fill-amber-400' : 'text-border'}`} />
      ))}
    </div>
  );
}

export default function AdminReviewsClient() {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getReviews().then((data) => {
      setReviews(data);
      setLoading(false);
    });
  }, []);

  function handleDelete(id: string) {
    if (!confirm('Delete this review?')) return;
    startTransition(async () => {
      const result = await deleteReview(id);
      if (result.success) {
        setReviews((prev) => prev.filter((r) => r._id !== id));
        toast.success('Review deleted');
      } else {
        toast.error('Failed to delete review');
      }
    });
  }

  const filtered = reviews.filter(
    (r) =>
      !search ||
      r.customerName?.toLowerCase().includes(search.toLowerCase()) ||
      r.comment?.toLowerCase().includes(search.toLowerCase())
  );

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : 'N/A';

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Reviews</h1>
          <p className="text-sm text-muted-foreground">Moderate customer product reviews.</p>
        </div>
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="border-amber-500/30 text-amber-500 bg-amber-500/10">
            ★ {avgRating} avg
          </Badge>
          <Badge variant="outline" className="border-border/60">{reviews.length} total</Badge>
        </div>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <input
          type="text"
          placeholder="Search reviews..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
        />
      </div>

      {/* Reviews Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-muted-foreground text-sm">
          <MessageSquare className="h-10 w-10 mx-auto mb-3 opacity-30" />
          No reviews found.
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((review) => (
            <div key={review._id} className="bg-card border border-border/50 rounded-2xl p-5 space-y-3 hover:border-primary/20 transition-colors group relative">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <p className="font-semibold text-foreground text-sm">{review.customerName}</p>
                  <p className="text-xs text-muted-foreground">{review.customerEmail}</p>
                </div>
                <button
                  onClick={() => handleDelete(review._id)}
                  disabled={isPending}
                  className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
              <StarRating rating={review.rating} />
              {review.product?.name && (
                <p className="text-[11px] text-muted-foreground font-medium">Product: {review.product.name}</p>
              )}
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-4">{review.comment}</p>
              <div className="flex items-center justify-between pt-2 border-t border-border/40">
                <span className="text-xs text-muted-foreground">
                  {new Date(review.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                </span>
                {review.rating >= 4 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/30">
                    Positive
                  </span>
                )}
                {review.rating <= 2 && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
                    Negative
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
