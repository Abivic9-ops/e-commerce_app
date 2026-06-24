'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';
import { Product } from '@/lib/db/models/Product';
import { requireRole } from '@/lib/supabase/auth';

/**
 * Creates a new product review and updates average product rating
 */
export async function createReview(data: {
  productId: string;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
}) {
  try {
    await connectToDatabase();

    const newReview = new Review({
      product: data.productId,
      rating: data.rating,
      comment: data.comment,
      customerName: data.customerName,
      customerEmail: data.customerEmail,
    });

    await newReview.save();

    // Re-calculate product rating metrics
    const reviews = await Review.find({ product: data.productId });
    const count = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / count;

    await Product.findByIdAndUpdate(data.productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: count,
    });

    revalidatePath('/');
    revalidatePath(`/product/${data.productId}`);
    return { success: true };
  } catch (error: any) {
    console.error('Error creating review:', error);
    return { success: false, error: error.message || 'Failed to submit review' };
  }
}

/**
 * Fetches all reviews for a specific product
 */
export async function getProductReviews(productId: string) {
  try {
    await connectToDatabase();
    const reviews = await Review.find({ product: productId }).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    return [];
  }
}

/**
 * Fetches all reviews across all products (for Admin dashboard)
 */
export async function getReviews() {
  try {
    await connectToDatabase();
    const reviews = await Review.find({}).populate('product', 'name slug').sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(reviews));
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
}

/**
 * Admin action to delete a review and update metrics
 */
export async function deleteReview(id: string) {
  await requireRole('admin');
  try {
    await connectToDatabase();

    const review = await Review.findByIdAndDelete(id);
    if (!review) {
      return { success: false, error: 'Review not found' };
    }

    // Re-calculate average rating for that product
    const reviews = await Review.find({ product: review.product });
    const count = reviews.length;
    const avgRating = count > 0 ? reviews.reduce((sum, r) => sum + r.rating, 0) / count : 0;

    await Product.findByIdAndUpdate(review.product, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: count,
    });

    revalidatePath('/admin/reviews');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting review:', error);
    return { success: false, error: error.message || 'Failed to delete review' };
  }
}
