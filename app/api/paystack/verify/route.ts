import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { Product } from '@/lib/db/models/Product';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const reference = searchParams.get('reference') || searchParams.get('trxref');

    if (!reference) {
      return NextResponse.json({ error: 'Missing reference' }, { status: 400 });
    }

    await connectToDatabase();

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }

    const paystackRes = await fetch(
      `https://api.paystack.co/transaction/verify/${encodeURIComponent(reference)}`,
      {
        headers: { Authorization: `Bearer ${paystackSecretKey}` },
      }
    );

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Verification failed' },
        { status: 400 }
      );
    }

    const { data } = paystackData;
    const order = await Order.findOne({ orderId: data.reference });
    if (!order) {
      return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    }

    if (data.status === 'success') {
      order.paymentStatus = 'paid';
      order.paystackDetails = {
        ...order.paystackDetails,
        reference: data.reference,
        transactionId: data.id,
        channel: data.channel,
        cardType: data.authorization?.card_type,
        last4: data.authorization?.last4,
        paidAt: data.paid_at ? new Date(data.paid_at) : new Date(),
        receiptNumber: data.reference,
        currency: data.currency,
        gatewayResponse: data.gateway_response,
      };

      for (const item of order.items) {
        const isMongoId = mongoose.Types.ObjectId.isValid(item.product);
        const product = isMongoId
          ? await Product.findById(item.product)
          : await Product.findOne({ slug: item.product });
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          product.sold = (product.sold || 0) + item.quantity;
          await product.save();
        }
      }
    } else {
      order.paymentStatus = 'failed';
      order.paystackDetails = {
        ...order.paystackDetails,
        gatewayResponse: data.gateway_response || data.status,
      };
    }

    await order.save();

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/payments');
    revalidatePath('/orders');

    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const statusParam = data.status === 'success' ? 'success' : 'failed';
    return NextResponse.redirect(
      new URL(`/checkout/success?orderId=${order.orderId}&status=${statusParam}`, appUrl)
    );

  } catch (error: any) {
    console.error('Paystack verify error:', error);
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    return NextResponse.redirect(new URL('/checkout?error=verification_failed', appUrl));
  }
}
