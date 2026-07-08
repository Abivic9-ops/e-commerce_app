import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { email, items, customerDetails, subtotal, shippingFee, total } = body;

    if (!email || !items || !customerDetails || !total) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);

    const user = await getCurrentUser();
    const newOrder = new Order({
      orderId,
      userId: user?.id || undefined,
      customerDetails: {
        fullName: customerDetails.fullName,
        phone: customerDetails.phone,
        address: customerDetails.address,
        city: customerDetails.city,
      },
      items,
      subtotal,
      shippingFee,
      total,
      paymentStatus: 'pending',
      deliveryStatus: 'placed',
    });

    await newOrder.save();

    const paystackSecretKey = process.env.PAYSTACK_SECRET_KEY;
    if (!paystackSecretKey) {
      return NextResponse.json({ error: 'Paystack not configured' }, { status: 500 });
    }

    const paystackRes = await fetch('https://api.paystack.co/transaction/initialize', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${paystackSecretKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        amount: Math.round(total * 100),
        reference: orderId,
        currency: 'KES',
        callback_url: `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/api/paystack/verify`,
        metadata: {
          orderId,
          customer_name: customerDetails.fullName,
        },
      }),
    });

    const paystackData = await paystackRes.json();

    if (!paystackRes.ok || !paystackData.status) {
      return NextResponse.json(
        { error: paystackData.message || 'Failed to initialize payment' },
        { status: 400 }
      );
    }

    newOrder.paystackDetails = {
      reference: paystackData.data.reference,
      accessCode: paystackData.data.access_code,
    };
    await newOrder.save();

    return NextResponse.json({
      success: true,
      orderId,
      authorization_url: paystackData.data.authorization_url,
      access_code: paystackData.data.access_code,
      reference: paystackData.data.reference,
    });

  } catch (error: any) {
    console.error('Paystack initialize error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment' },
      { status: 500 }
    );
  }
}
