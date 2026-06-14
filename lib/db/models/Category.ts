import mongoose, { Schema, Document } from 'mongoose';

export interface ICategory extends Document {
  name: string;
  slug: string;
  image?: string;
  iconName?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
    image: { type: String, default: '' },
    iconName: { type: String, default: '' },
  },
  { timestamps: true }
);

export const Category = mongoose.models.Category || mongoose.model<ICategory>('Category', CategorySchema);
