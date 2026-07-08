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
  paystackDetails?: {
    reference?: string;
    accessCode?: string;
    transactionId?: number;
    channel?: string;
    cardType?: string;
    last4?: string;
    paidAt?: Date;
    receiptNumber?: string;
    currency?: string;
    gatewayResponse?: string;
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
    paystackDetails: {
      reference: { type: String },
      accessCode: { type: String },
      transactionId: { type: Number },
      channel: { type: String },
      cardType: { type: String },
      last4: { type: String },
      paidAt: { type: Date },
      receiptNumber: { type: String },
      currency: { type: String },
      gatewayResponse: { type: String },
    },
  },
  { timestamps: true }
);

export const Order = mongoose.models.Order || mongoose.model<IOrder>('Order', OrderSchema);
