import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import mongoose from 'mongoose';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { Product } from '@/lib/db/models/Product';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const signature = req.headers.get('x-paystack-signature');

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }

    const crypto = await import('crypto');
    const expectedSignature = crypto
      .createHmac('sha512', paystackSecretKey)
      .update(JSON.stringify(body))
      .digest('hex');

    if (signature !== expectedSignature) {
      return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
    }

    const event = body.event;

    if (event !== 'charge.success') {
      return NextResponse.json({ message: `Event ${event} ignored` });
    }

    const data = body.data;
    const reference = data.reference;

    await connectToDatabase();

    const order = await Order.findOne({ orderId: reference });
    if (!order) {
      console.warn(`[PAYSTACK WEBHOOK] Order not found for reference: ${reference}`);
      return NextResponse.json({ message: 'Order not found' }, { status: 200 });
    }

    if (order.paymentStatus === 'paid') {
      return NextResponse.json({ message: 'Already processed' });
    }

    order.paymentStatus = 'paid';
    order.paystackDetails = {
      reference: data.reference,
      accessCode: order.paystackDetails?.accessCode,
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

    await order.save();
    console.log(`[PAYSTACK WEBHOOK] Order ${order.orderId} marked as paid`);

    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/admin/orders');
    revalidatePath('/admin/payments');
    revalidatePath('/orders');

    return NextResponse.json({ message: 'Webhook processed successfully' });

  } catch (error: any) {
    console.error('[PAYSTACK WEBHOOK ERROR]:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
