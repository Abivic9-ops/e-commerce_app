'use server';

import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { Product } from '@/lib/db/models/Product';
import { requireRole, getCurrentUser } from '@/lib/supabase/auth';

/**
 * Creates a new pending order
 */
export async function createOrder(data: {
  orderId: string;
  customerDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  items: Array<{
    product: string;
    name: string;
    price: number;
    quantity: number;
    image: string;
  }>;
  subtotal: number;
  shippingFee: number;
  total: number;
}) {
  try {
    await connectToDatabase();
    
    // Retrieve user session if logged in
    const user = await getCurrentUser();

    const newOrder = new Order({
      orderId: data.orderId,
      userId: user?.id || undefined,
      customerDetails: data.customerDetails,
      items: data.items,
      subtotal: data.subtotal,
      shippingFee: data.shippingFee,
      total: data.total,
      paymentStatus: 'pending',
      deliveryStatus: 'placed',
    });

    await newOrder.save();
    
    revalidatePath('/admin');
    return { success: true, order: JSON.parse(JSON.stringify(newOrder)) };
  } catch (error: any) {
    console.error('Error creating order:', error);
    return { success: false, error: error.message || 'Failed to create order' };
  }
}

/**
 * Retrieves orders with options (for Admin or User)
 */
export async function getOrders(filters?: { limit?: number; userId?: string }) {
  try {
    await connectToDatabase();
    
    const query: any = {};
    if (filters?.userId) {
      query.userId = filters.userId;
    }

    let dbQuery = Order.find(query).sort({ createdAt: -1 });
    if (filters?.limit) {
      dbQuery = dbQuery.limit(filters.limit);
    }

    const orders = await dbQuery.lean();
    return JSON.parse(JSON.stringify(orders));
  } catch (error) {
    console.error('Error fetching orders:', error);
    return [];
  }
}

/**
 * Retrieves a single order by orderId or database ID
 */
export async function getOrderById(id: string) {
  try {
    await connectToDatabase();
    
    // Validate object ID condition safely
    const isMongoId = mongoose.Types.ObjectId.isValid(id);
    
    const query = isMongoId 
      ? { $or: [{ orderId: id }, { _id: new mongoose.Types.ObjectId(id) }] }
      : { orderId: id };

    const order = await Order.findOne(query).lean();
    return order ? JSON.parse(JSON.stringify(order)) : null;
  } catch (error) {
    console.error('Error fetching order by ID:', error);
    return null;
  }
}

/**
 * Admin action to update order status
 */
export async function updateOrderStatus(id: string, deliveryStatus: string, paymentStatus?: string) {
  await requireRole('admin');
  await connectToDatabase();

  try {
    const updateData: any = { deliveryStatus };
    if (paymentStatus) {
      updateData.paymentStatus = paymentStatus;
    }

    const updated = await Order.findByIdAndUpdate(id, updateData, { new: true });
    
    if (!updated) {
      return { success: false, error: 'Order not found' };
    }

    revalidatePath('/admin');
    revalidatePath(`/admin/orders`);
    return { success: true };
  } catch (error: any) {
    console.error('Error updating order status:', error);
    return { success: false, error: error.message || 'Failed to update order status' };
  }
}

/**
 * Admin action to retrieve dashboard KPIs
 */
export async function getOrderStats() {
  try {
    await requireRole('admin');
    await connectToDatabase();
  } catch (error) {
    console.error('Error in auth/db setup for order stats:', error);
    return {
      stats: { totalSales: 0, activeProducts: 0, pendingOrders: 0, customerCount: 0 },
      recentOrders: []
    };
  }

  try {
    // 1. Total revenue (sum of total for Paid orders)
    const revenueResult = await Order.aggregate([
      { $match: { paymentStatus: 'paid' } },
      { $group: { _id: null, totalSales: { $sum: '$total' } } }
    ]);
    const totalSales = revenueResult[0]?.totalSales || 0;

    // 2. Active Catalog count
    const activeProducts = await Product.countDocuments({});

    // 3. Pending Orders count (placed or processing)
    const pendingOrders = await Order.countDocuments({
      deliveryStatus: { $in: ['placed', 'processing'] }
    });

    // 4. Customers count (number of unique phones)
    const customerPhones = await Order.distinct('customerDetails.phone');
    const customerCount = customerPhones.length;

    // 5. Recent orders for activity feed
    const recentOrders = await Order.find({}).sort({ createdAt: -1 }).limit(5).lean();

    return {
      stats: {
        totalSales,
        activeProducts,
        pendingOrders,
        customerCount
      },
      recentOrders: JSON.parse(JSON.stringify(recentOrders))
    };
  } catch (error) {
    console.error('Error calculating order stats:', error);
    return {
      stats: { totalSales: 0, activeProducts: 0, pendingOrders: 0, customerCount: 0 },
      recentOrders: []
    };
  }
}
