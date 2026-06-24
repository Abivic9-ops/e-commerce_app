import React from 'react';
import AdminOrdersClient from './OrdersClient';

export const metadata = {
  title: 'Orders - ShopEasy Admin',
  description: 'Manage all customer orders.',
};

export default function AdminOrdersPage() {
  return <AdminOrdersClient />;
}
