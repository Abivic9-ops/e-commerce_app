import React from 'react';
import AdminReviewsClient from './ReviewsClient';

export const metadata = {
  title: 'Reviews - ShopEasy Admin',
  description: 'Moderate customer product reviews.',
};

export default function AdminReviewsPage() {
  return <AdminReviewsClient />;
}
