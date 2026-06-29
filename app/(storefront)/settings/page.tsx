import React from 'react';
import { Settings as SettingsIcon } from 'lucide-react';
import { getCurrentUser } from '@/lib/supabase/auth';
import { getUserSettingsAction } from '@/app/actions/settings';
import SettingsClient, { type SettingsData } from './SettingsClient';
import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Settings - ShopEasy',
  description: 'Manage your account settings and preferences.',
};

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const user = await getCurrentUser();

  if (!user) {
    redirect('/login?redirectTo=/settings');
  }

  const result = await getUserSettingsAction();
  const settings: SettingsData | null = result.success && result.settings ? result.settings : null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20 space-y-10">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center justify-center p-3 bg-primary/10 rounded-2xl mb-4">
          <SettingsIcon className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
          Settings
        </h1>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Customize your experience, manage notifications, and control your privacy.
        </p>
      </div>

      <SettingsClient
        userEmail={user.email || ''}
        initialSettings={settings}
      />
    </div>
  );
}
