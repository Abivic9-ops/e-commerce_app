'use client';

import React, { useState, useEffect } from 'react';
import { Star, User, ChevronDown, ChevronUp } from 'lucide-react';

interface Review {
  _id: string;
  product: string;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
  createdAt: string;
}

interface ProductReviewsProps {
  productId: string;
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-KE', { year: 'numeric', month: 'short', day: 'numeric' });
}

export default function ProductReviews({ productId }: ProductReviewsProps) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ customerName: '', rating: 5, comment: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetch(`/api/reviews?productId=${productId}`)
      .then(res => res.json())
      .then(data => { setReviews(data); setLoading(false); })
      .catch(() => setLoading(false));
  }, [productId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.customerName.trim() || !formData.comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...formData, productId }),
      });
      const data = await res.json();
      if (data.success) {
        setReviews(prev => [data.review, ...prev]);
        setFormData({ customerName: '', rating: 5, comment: '' });
        setShowForm(false);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-gray-900">Customer Reviews</h2>
          <p className="text-sm text-gray-500">{reviews.length} review{reviews.length !== 1 ? 's' : ''}</p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm font-medium text-gray-900 border border-gray-200 rounded-lg px-3 py-1.5 hover:bg-gray-50 transition-colors cursor-pointer"
        >
          {showForm ? 'Cancel' : 'Write a Review'}
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="bg-gray-50 border border-gray-200 rounded-xl p-5 mb-6 space-y-4">
          <h3 className="text-sm font-semibold text-gray-900">Share your feedback</h3>
          <div>
            <input
              type="text"
              placeholder="Your name"
              value={formData.customerName}
              onChange={e => setFormData(prev => ({ ...prev, customerName: e.target.value }))}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10"
              required
            />
          </div>
          <div>
            <div className="flex items-center gap-1 mb-1">
              {[1, 2, 3, 4, 5].map(n => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setFormData(prev => ({ ...prev, rating: n }))}
                  className="cursor-pointer"
                >
                  <Star className={`h-5 w-5 ${n <= formData.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`} />
                </button>
              ))}
            </div>
          </div>
          <div>
            <textarea
              placeholder="Write your review..."
              value={formData.comment}
              onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
              rows={3}
              className="w-full px-3 py-2 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-900/10 resize-none"
              required
            />
          </div>
          <button
            type="submit"
            disabled={submitting}
            className="px-4 py-2 bg-gray-900 text-white text-sm font-semibold rounded-lg hover:bg-gray-800 disabled:opacity-50 transition-colors cursor-pointer"
          >
            {submitting ? 'Submitting...' : 'Submit Review'}
          </button>
        </form>
      )}

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="animate-pulse bg-gray-100 rounded-xl h-24" />
          ))}
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-12 text-gray-400">
          <p className="text-sm">No reviews yet. Be the first to review this product!</p>
        </div>
      ) : (
        <div className="space-y-4">
          {reviews.map(review => (
            <div key={review._id} className="bg-white border border-gray-100 rounded-xl p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex items-center gap-2">
                  <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center">
                    <User className="h-4 w-4 text-gray-500" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{review.customerName}</p>
                    <p className="text-xs text-gray-400">{formatDate(review.createdAt)}</p>
                  </div>
                </div>
                <div className="flex">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} className={`h-3.5 w-3.5 ${i < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-200'}`} />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-600 leading-relaxed">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}