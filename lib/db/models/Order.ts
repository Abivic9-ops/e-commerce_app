import mongoose, { Schema, Document } from 'mongoose';

export interface IOrderItem {
  product: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}

export interface IOrder extends Document {
  orderId: string; // e.g., ORD-XXXXXX
  userId?: string; // Supabase user ID if authenticated
  customerDetails: {
    fullName: string;
    phone: string;
    address: string;
    city: string;
  };
  items: IOrderItem[];
  subtotal: number;
  shippingFee: number;
  total: number;
  paymentStatus: 'pending' | 'paid' | 'failed';
  deliveryStatus: 'placed' | 'processing' | 'shipped' | 'delivered';
  mpesaDetails?: {
    MerchantRequestID?: string;
    CheckoutRequestID?: string;
    ReceiptNumber?: string;
    ResultCode?: number;
    ResultDesc?: string;
    phoneNumber?: string;
    transactionDate?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>({
  product: { type: String, required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 1 },
  image: { type: String, required: true },
});

const OrderSchema = new Schema<IOrder>(
  {
    orderId: { type: String, required: true, unique: true },
    userId: { type: String },
    customerDetails: {
      fullName: { type: String, required: true },
      phone: { type: String, required: true },
      address: { type: String, required: true },
      city: { type: String, required: true },
    },
    items: [OrderItemSchema],
    subtotal: { type: Number, required: true, min: 0 },
    shippingFee: { type: Number, required: true, min: 0, default: 350 },
    total: { type: Number, required: true, min: 0 },
    paymentStatus: {
      type: String,
      required: true,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
    },
    deliveryStatus: {
      type: String,
      required: true,
      enum: ['placed', 'processing', 'shipped', 'delivered'],
      default: 'placed',
    },
    mpesaDetails: {
      MerchantRequestID: { type: String },
      CheckoutRequestID: { type: String },
      ReceiptNumber: { type: String },
      ResultCode: { type: Number },
      ResultDesc: { type: String },
      phoneNumber: { type: String },
      transactionDate: { type: Date },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
