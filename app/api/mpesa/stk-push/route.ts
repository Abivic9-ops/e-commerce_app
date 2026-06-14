import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { phone, amount } = body;

    if (!phone || !amount) {
      return NextResponse.json({ error: 'Phone and amount are required' }, { status: 400 });
    }

    // TODO: Phase 6+ Daraja Integration
    // This is where we will use Safaricom Daraja API
    // 1. Get OAuth Token
    // 2. Format Timestamp & Password
    // 3. POST to /mpesa/stkpush/v1/processrequest
    
    console.log(`[MOCK M-PESA] Initiating STK push for ${phone} amount ${amount}`);

    // Mock successful STK push initiation
    return NextResponse.json({
      MerchantRequestID: "29115-34620561-1",
      CheckoutRequestID: "ws_CO_191220231530_" + Date.now(),
      ResponseCode: "0",
      ResponseDescription: "Success. Request accepted for processing",
      CustomerMessage: "Success. Request accepted for processing"
    });

  } catch (error) {
    console.error('M-Pesa STK Push error:', error);
    return NextResponse.json(
      { error: 'Failed to initiate M-Pesa payment' },
      { status: 500 }
    );
  }
}
