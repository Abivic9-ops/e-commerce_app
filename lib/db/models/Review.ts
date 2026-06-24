import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  product: mongoose.Types.ObjectId;
  rating: number;
  comment: string;
  customerName: string;
  customerEmail: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    product: { type: Schema.Types.ObjectId, ref: 'Product', required: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    customerName: { type: String, required: true },
    customerEmail: { type: String, required: true },
  },
  { timestamps: true }
);

export const Review = mongoose.models.Review || mongoose.model<IReview>('Review', ReviewSchema);
