import { NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { Product } from '@/lib/db/models/Product';

export async function POST(req: Request) {
  try {
    await connectToDatabase();
    
    const body = await req.json();
    console.log('[M-PESA CALLBACK WEBHOOK RECEIVED]:', JSON.stringify(body, null, 2));

    const stkCallback = body?.Body?.stkCallback;
    if (!stkCallback) {
      return NextResponse.json({ error: 'Invalid payload structure' }, { status: 400 });
    }

    const { MerchantRequestID, CheckoutRequestID, ResultCode, ResultDesc, CallbackMetadata } = stkCallback;

    // Find order in MongoDB matching this CheckoutRequestID
    const order = await Order.findOne({ 'mpesaDetails.CheckoutRequestID': CheckoutRequestID });

    if (!order) {
      console.warn(`[M-PESA CALLBACK WARNING] No order found matching CheckoutRequestID: ${CheckoutRequestID}`);
      // Return 200 to Safaricom to stop retries even if order is missing
      return NextResponse.json({ message: 'Callback acknowledged (Order not found)' }, { status: 200 });
    }

    // Prepare update parameters
    order.mpesaDetails.ResultCode = ResultCode;
    order.mpesaDetails.ResultDesc = ResultDesc;

    if (ResultCode === 0) {
      // Payment Successful
      order.paymentStatus = 'paid';
      
      // Parse metadata items
      const items = CallbackMetadata?.Item || [];
      const getVal = (name: string) => items.find((i: any) => i.Name === name)?.Value;
      
      const receiptNumber = getVal('MpesaReceiptNumber') || 'RECEIPT-MOCK';
      const phoneVal = getVal('PhoneNumber');
      const transDate = getVal('TransactionDate');

      order.mpesaDetails.ReceiptNumber = receiptNumber;
      if (phoneVal) order.mpesaDetails.phoneNumber = phoneVal.toString();
      if (transDate) {
        // Format timestamp string to Date
        const dateStr = transDate.toString();
        if (dateStr.length === 14) {
          const year = parseInt(dateStr.slice(0, 4));
          const month = parseInt(dateStr.slice(4, 6)) - 1;
          const day = parseInt(dateStr.slice(6, 8));
          const hour = parseInt(dateStr.slice(8, 10));
          const min = parseInt(dateStr.slice(10, 12));
          const sec = parseInt(dateStr.slice(12, 14));
          order.mpesaDetails.transactionDate = new Date(year, month, day, hour, min, sec);
        } else {
          order.mpesaDetails.transactionDate = new Date();
        }
      } else {
        order.mpesaDetails.transactionDate = new Date();
      }

      // Decrement inventory stock & increment sold count
      console.log(`[PAYMENT VERIFIED] Order ${order.orderId} paid. Adjusting inventory...`);
      for (const item of order.items) {
        const product = await Product.findById(item.product);
        if (product) {
          product.stock = Math.max(0, product.stock - item.quantity);
          product.sold = (product.sold || 0) + item.quantity;
          await product.save();
          console.log(`[INVENTORY REDUCED] Product ${product.name} stock: ${product.stock}, sold: ${product.sold}`);
        }
      }
    } else {
      // Payment Failed or Cancelled
      order.paymentStatus = 'failed';
      console.warn(`[PAYMENT FAILED] Order ${order.orderId} was rejected by user or failed (Code: ${ResultCode}, Desc: ${ResultDesc})`);
    }

    await order.save();
    
    // Refresh Next.js caches
    revalidatePath('/');
    revalidatePath('/admin');
    revalidatePath('/orders');

    return NextResponse.json({ message: 'Callback processed successfully' }, { status: 200 });

  } catch (error: any) {
    console.error('[M-PESA CALLBACK ERROR]:', error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}

