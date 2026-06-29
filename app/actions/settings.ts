'use server';

import { revalidatePath } from 'next/cache';
import { connectToDatabase } from '@/lib/db/mongoose';
import { UserSettings } from '@/lib/db/models/UserSettings';
import { getCurrentUser } from '@/lib/supabase/auth';

export async function getUserSettingsAction() {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    await connectToDatabase();

    let settings = await UserSettings.findOne({ userId: user.id });

    if (!settings) {
      settings = await UserSettings.create({
        userId: user.id,
        profile: {
          fullName: user.email?.split('@')[0] || '',
          phone: '',
          defaultAddress: '',
          city: '',
        },
        notifications: {
          email: true,
          sms: true,
          orderUpdates: true,
          promotions: false,
          newsletters: false,
        },
        privacy: {
          showProfile: true,
          dataCollection: true,
        },
      });
    }

    return {
      success: true,
      settings: {
        userId: settings.userId,
        profile: settings.profile,
        notifications: settings.notifications,
        privacy: settings.privacy,
      },
    };
  } catch (error: any) {
    console.error('Error fetching user settings:', error);
    return { success: false, error: error.message || 'Failed to fetch settings.' };
  }
}

export async function updateProfileAction(data: {
  fullName: string;
  phone: string;
  defaultAddress: string;
  city: string;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId: user.id },
      { $set: { profile: data } },
      { upsert: true, new: true }
    );

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating profile:', error);
    return { success: false, error: error.message || 'Failed to update profile.' };
  }
}

export async function updateNotificationsAction(data: {
  email: boolean;
  sms: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletters: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId: user.id },
      { $set: { notifications: data } },
      { upsert: true, new: true }
    );

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating notifications:', error);
    return { success: false, error: error.message || 'Failed to update notification settings.' };
  }
}

export async function updatePrivacyAction(data: {
  showProfile: boolean;
  dataCollection: boolean;
}) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return { success: false, error: 'Not authenticated.' };
    }

    await connectToDatabase();

    await UserSettings.findOneAndUpdate(
      { userId: user.id },
      { $set: { privacy: data } },
      { upsert: true, new: true }
    );

    revalidatePath('/settings');
    return { success: true };
  } catch (error: any) {
    console.error('Error updating privacy settings:', error);
    return { success: false, error: error.message || 'Failed to update privacy settings.' };
  }
}
