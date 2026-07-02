import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Review } from '@/lib/db/models/Review';
import { Product } from '@/lib/db/models/Product';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(request.url);
    const productId = searchParams.get('productId');

    if (!productId) {
      return NextResponse.json([]);
    }

    const reviews = await Review.find({ product: productId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(reviews);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return NextResponse.json([], { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    const body = await request.json();
    const { productId, rating, comment, customerName, customerEmail } = body;

    if (!productId || !rating || !comment || !customerName) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const newReview = await Review.create({
      product: productId,
      rating,
      comment,
      customerName,
      customerEmail: customerEmail || 'anonymous@guest.com',
    });

    const reviews = await Review.find({ product: productId });
    const count = reviews.length;
    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / count;

    await Product.findByIdAndUpdate(productId, {
      rating: Math.round(avgRating * 10) / 10,
      reviewsCount: count,
    });

    return NextResponse.json({
      success: true,
      review: {
        _id: newReview._id,
        product: newReview.product,
        rating: newReview.rating,
        comment: newReview.comment,
        customerName: newReview.customerName,
        createdAt: newReview.createdAt,
      },
    });
  } catch (error: any) {
    console.error('Error creating review:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit review' },
      { status: 500 }
    );
  }
}