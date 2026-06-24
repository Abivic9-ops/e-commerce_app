import { NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function POST(req: Request) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const { phone, amount, items, customerDetails, subtotal, shippingFee, total } = body;

    if (!phone || !amount || !items || !customerDetails) {
      return NextResponse.json({ error: 'Missing required order details' }, { status: 400 });
    }

    // Generate custom Order Reference ID
    const orderId = 'ORD-' + Math.floor(100000 + Math.random() * 900000);
    
    // Check if M-Pesa details are placeholders
    const consumerKey = process.env.MPESA_CONSUMER_KEY || 'placeholder';
    const consumerSecret = process.env.MPESA_CONSUMER_SECRET || 'placeholder';
    const isSimulator = consumerKey === 'placeholder' || consumerSecret === 'placeholder';

    const shortcode = process.env.MPESA_SHORTCODE || '174379';
    const passkey = process.env.MPESA_PASSKEY || 'bfb279f9aa9bdbcf158e97dd71a467cd2e0c893059b10f78e6b72ada1ed2c919';
    const callbackUrl = process.env.MPESA_CALLBACK_URL || 'http://localhost:3000/api/mpesa/callback';

    let merchantRequestId = 'MRQ-' + Math.floor(100000 + Math.random() * 900000);
    let checkoutRequestId = 'ws_CO_' + Date.now();

    // 1. If live production / sandbox credentials exist
    if (!isSimulator) {
      try {
        // A. Generate M-Pesa Access Token
        const auth = Buffer.from(`${consumerKey}:${consumerSecret}`).toString('base64');
        const tokenRes = await fetch('https://sandbox.safaricom.co.ke/oauth/v1/generate?grant_type=client_credentials', {
          headers: { Authorization: `Basic ${auth}` },
        });

        if (!tokenRes.ok) throw new Error('Failed to generate Daraja token');
        const tokenData = await tokenRes.json();
        const accessToken = tokenData.access_token;

        // B. Form timestamp and password
        const date = new Date();
        const timestamp = 
          date.getFullYear().toString() +
          (date.getMonth() + 1).toString().padStart(2, '0') +
          date.getDate().toString().padStart(2, '0') +
          date.getHours().toString().padStart(2, '0') +
          date.getMinutes().toString().padStart(2, '0') +
          date.getSeconds().toString().padStart(2, '0');

        const mpesaPassword = Buffer.from(`${shortcode}${passkey}${timestamp}`).toString('base64');

        // C. Fire STK Push Process Request
        const stkPushRes = await fetch('https://sandbox.safaricom.co.ke/mpesa/stkpush/v1/processrequest', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            BusinessShortCode: shortcode,
            Password: mpesaPassword,
            Timestamp: timestamp,
            TransactionType: 'CustomerPayBillOnline',
            Amount: Math.round(amount),
            PartyA: phone,
            PartyB: shortcode,
            PhoneNumber: phone,
            CallBackURL: callbackUrl,
            AccountReference: orderId,
            TransactionDesc: `Pay for Order ${orderId}`,
          }),
        });

        if (!stkPushRes.ok) {
          const errData = await stkPushRes.json();
          throw new Error(errData.errorMessage || 'STK Push failed to fire');
        }

        const stkPushData = await stkPushRes.json();
        
        merchantRequestId = stkPushData.MerchantRequestID;
        checkoutRequestId = stkPushData.CheckoutRequestID;
      } catch (err: any) {
        console.error('[M-PESA DARAJA CLIENT ERROR] Falling back to simulation due to:', err.message);
      }
    }

    // 2. Create the pending order record in MongoDB
    const user = await getCurrentUser();
    const newOrder = new Order({
      orderId,
      userId: user?.id || undefined,
      customerDetails: {
        fullName: customerDetails.fullName,
        phone,
        address: customerDetails.address,
        city: customerDetails.city,
      },
      items,
      subtotal,
      shippingFee,
      total,
      paymentStatus: 'pending',
      deliveryStatus: 'placed',
      mpesaDetails: {
        MerchantRequestID: merchantRequestId,
        CheckoutRequestID: checkoutRequestId,
      },
    });

    await newOrder.save();
    console.log(`[ORDER CREATED] Saved pending order ${orderId} associated with checkout: ${checkoutRequestId}`);

    // 3. If in simulator fallback mode, trigger self-callback after 5 seconds to mock payment confirmation
    if (isSimulator) {
      setTimeout(async () => {
        try {
          const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
          const callbackPayload = {
            Body: {
              stkCallback: {
                MerchantRequestID: merchantRequestId,
                CheckoutRequestID: checkoutRequestId,
                ResultCode: 0,
                ResultDesc: 'The service request is processed successfully.',
                CallbackMetadata: {
                  Item: [
                    { Name: 'Amount', Value: amount },
                    { Name: 'MpesaReceiptNumber', Value: 'NLX' + Math.floor(10000000 + Math.random() * 90000000) },
                    { Name: 'TransactionDate', Value: Date.now() },
                    { Name: 'PhoneNumber', Value: parseInt(phone) },
                  ],
                },
              },
            },
          };

          await fetch(`${appUrl}/api/mpesa/callback`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(callbackPayload),
          });
          console.log(`[MPESA SIMULATOR] Callback webhook fired for Checkout: ${checkoutRequestId}`);
        } catch (webhookErr) {
          console.error('[MPESA SIMULATOR ERROR] Firing webhook:', webhookErr);
        }
      }, 5000);
    }

    return NextResponse.json({
      success: true,
      orderId,
      CheckoutRequestID: checkoutRequestId,
    });

  } catch (error: any) {
    console.error('M-Pesa STK Push error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initiate M-Pesa payment' },
      { status: 500 }
    );
  }
}

