'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Coupon } from '@/lib/db/models/Coupon';
import { requireRole } from '@/lib/supabase/auth';

/**
 * Retrieves all coupons sorted by creation date
 */
export async function getCoupons() {
  try {
    await connectToDatabase();
    const coupons = await Coupon.find({}).sort({ createdAt: -1 }).lean();
    return JSON.parse(JSON.stringify(coupons));
  } catch (error) {
    console.error('Error fetching coupons:', error);
    return [];
  }
}

/**
 * Admin action to create a new coupon code
 */
export async function createCoupon(data: {
  code: string;
  discountType: 'percentage' | 'flat';
  discountValue: number;
  minAmount?: number;
}) {
  await requireRole('admin');
  try {
    await connectToDatabase();

    const cleanCode = data.code.trim().toUpperCase();
    const existing = await Coupon.findOne({ code: cleanCode });
    
    if (existing) {
      return { success: false, error: 'Coupon code already exists' };
    }

    const newCoupon = new Coupon({
      code: cleanCode,
      discountType: data.discountType,
      discountValue: data.discountValue,
      minAmount: data.minAmount || undefined,
      active: true,
    });

    await newCoupon.save();

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    console.error('Error creating coupon:', error);
    return { success: false, error: error.message || 'Failed to create coupon' };
  }
}

/**
 * Admin action to toggle coupon active status
 */
export async function toggleCouponStatus(id: string, active: boolean) {
  await requireRole('admin');
  try {
    await connectToDatabase();
    const coupon = await Coupon.findByIdAndUpdate(id, { active }, { new: true });
    
    if (!coupon) {
      return { success: false, error: 'Coupon not found' };
    }

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling coupon status:', error);
    return { success: false, error: error.message || 'Failed to update coupon' };
  }
}

/**
 * Admin action to delete a coupon code
 */
export async function deleteCoupon(id: string) {
  await requireRole('admin');
  try {
    await connectToDatabase();
    const coupon = await Coupon.findByIdAndDelete(id);
    
    if (!coupon) {
      return { success: false, error: 'Coupon not found' };
    }

    revalidatePath('/admin/coupons');
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting coupon:', error);
    return { success: false, error: error.message || 'Failed to delete coupon' };
  }
}

/**
 * Public action to validate a coupon during checkout
 */
export async function validateCoupon(code: string, currentTotal: number) {
  try {
    await connectToDatabase();

    const cleanCode = code.trim().toUpperCase();
    const coupon = await Coupon.findOne({ code: cleanCode, active: true });

    if (!coupon) {
      return { success: false, error: 'Invalid or expired coupon code' };
    }

    if (coupon.minAmount && currentTotal < coupon.minAmount) {
      return {
        success: false,
        error: `Minimum order amount of KES ${coupon.minAmount} required to use this coupon`,
      };
    }

    let discountAmount = 0;
    if (coupon.discountType === 'percentage') {
      discountAmount = (currentTotal * coupon.discountValue) / 100;
    } else {
      discountAmount = coupon.discountValue;
    }

    // Don't let discount exceed total amount
    discountAmount = Math.min(discountAmount, currentTotal);

    return {
      success: true,
      code: coupon.code,
      discountType: coupon.discountType,
      discountValue: coupon.discountValue,
      discountAmount,
    };
  } catch (error: any) {
    console.error('Error validating coupon:', error);
    return { success: false, error: 'An error occurred during coupon validation' };
  }
}
