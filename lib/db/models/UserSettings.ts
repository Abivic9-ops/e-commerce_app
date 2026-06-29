import mongoose, { Schema, Document } from 'mongoose';

export interface IUserSettings extends Document {
  userId: string;
  profile: {
    fullName: string;
    phone: string;
    defaultAddress: string;
    city: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletters: boolean;
  };
  privacy: {
    showProfile: boolean;
    dataCollection: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSettingsSchema = new Schema<IUserSettings>(
  {
    userId: { type: String, required: true, unique: true },
    profile: {
      fullName: { type: String, default: '' },
      phone: { type: String, default: '' },
      defaultAddress: { type: String, default: '' },
      city: { type: String, default: '' },
    },
    notifications: {
      email: { type: Boolean, default: true },
      sms: { type: Boolean, default: true },
      orderUpdates: { type: Boolean, default: true },
      promotions: { type: Boolean, default: false },
      newsletters: { type: Boolean, default: false },
    },
    privacy: {
      showProfile: { type: Boolean, default: true },
      dataCollection: { type: Boolean, default: true },
    },
  },
  { timestamps: true }
);

export const UserSettings =
  mongoose.models.UserSettings ||
  mongoose.model<IUserSettings>('UserSettings', UserSettingsSchema);
