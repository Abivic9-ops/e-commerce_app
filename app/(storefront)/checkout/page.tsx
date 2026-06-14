import React from 'react';
import CheckoutClient from '@/components/storefront/CheckoutClient';

export const metadata = {
  title: 'Checkout - ShopEasy',
  description: 'Secure checkout and M-Pesa payment.',
};

export default function CheckoutPage() {
  return <CheckoutClient />;
}
