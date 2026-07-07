import React from 'react';
import AdminPaymentsClient from './PaymentsClient';

export const metadata = {
  title: 'Payments - ShopEasy Admin',
  description: 'Track and manage all customer payments.',
};

export default function AdminPaymentsPage() {
  return <AdminPaymentsClient />;
}
