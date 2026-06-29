'use client';

import React, { useState, useTransition } from 'react';
import {
  User,
  Bell,
  Shield,
  AlertTriangle,
  Save,
  Loader2,
  Mail,
  MapPin,
  Building2,
  Smartphone,
  Megaphone,
  Package,
  Newspaper,
  Eye,
  Database,
  Trash2,
} from 'lucide-react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  updateProfileAction,
  updateNotificationsAction,
  updatePrivacyAction,
} from '@/app/actions/settings';
import { toast } from 'sonner';

export interface SettingsData {
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
}

interface SettingsClientProps {
  userEmail: string;
  initialSettings: SettingsData | null;
}

function Toggle({ enabled, onChange, id }: { enabled: boolean; onChange: (v: boolean) => void; id: string }) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
      className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ${
        enabled ? 'bg-primary' : 'bg-border'
      }`}
    >
      <span
        className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-sm ring-0 transition-transform duration-200 ease-in-out ${
          enabled ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
}

export default function SettingsClient({ userEmail, initialSettings }: SettingsClientProps) {
  const [activeTab, setActiveTab] = useState('profile');

  const defaults: SettingsData = {
    profile: {
      fullName: userEmail.split('@')[0] || '',
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
  };

  const [profile, setProfile] = useState(initialSettings?.profile || defaults.profile);
  const [notifications, setNotifications] = useState(initialSettings?.notifications || defaults.notifications);
  const [privacy, setPrivacy] = useState(initialSettings?.privacy || defaults.privacy);

  const [profilePending, startProfileTransition] = useTransition();
  const [notifPending, startNotifTransition] = useTransition();
  const [privacyPending, startPrivacyTransition] = useTransition();

  function handleProfileSave(e: React.FormEvent) {
    e.preventDefault();
    startProfileTransition(async () => {
      const result = await updateProfileAction(profile);
      if (result.success) {
        toast.success('Profile updated successfully.');
      } else {
        toast.error(result.error || 'Failed to update profile.');
      }
    });
  }

  function handleNotificationSave() {
    startNotifTransition(async () => {
      const result = await updateNotificationsAction(notifications);
      if (result.success) {
        toast.success('Notification settings saved.');
      } else {
        toast.error(result.error || 'Failed to update notification settings.');
      }
    });
  }

  function handlePrivacySave() {
    startPrivacyTransition(async () => {
      const result = await updatePrivacyAction(privacy);
      if (result.success) {
        toast.success('Privacy settings saved.');
      } else {
        toast.error(result.error || 'Failed to update privacy settings.');
      }
    });
  }

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="w-full justify-start overflow-x-auto flex-nowrap">
        <TabsTrigger value="profile" className="gap-2">
          <User className="h-4 w-4" /> Profile
        </TabsTrigger>
        <TabsTrigger value="notifications" className="gap-2">
          <Bell className="h-4 w-4" /> Notifications
        </TabsTrigger>
        <TabsTrigger value="privacy" className="gap-2">
          <Shield className="h-4 w-4" /> Privacy
        </TabsTrigger>
        <TabsTrigger value="account" className="gap-2">
          <AlertTriangle className="h-4 w-4" /> Account
        </TabsTrigger>
      </TabsList>

      {/* Profile Tab */}
      <TabsContent value="profile">
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Profile Information</CardTitle>
            </div>
            <CardDescription>
              Update your personal details and default delivery address.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6">
            <form onSubmit={handleProfileSave} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-2">
                  <label htmlFor="fullName" className="text-sm font-semibold text-foreground">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="fullName"
                      value={profile.fullName}
                      onChange={(e) => setProfile({ ...profile, fullName: e.target.value })}
                      className="pl-10"
                      placeholder="Your full name"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-foreground">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      value={userEmail}
                      disabled
                      className="pl-10 opacity-60"
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">Email cannot be changed.</p>
                </div>
                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-semibold text-foreground">
                    Phone Number
                  </label>
                  <div className="relative">
                    <Smartphone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="phone"
                      value={profile.phone}
                      onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
                      className="pl-10"
                      placeholder="07XX XXX XXX"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="city" className="text-sm font-semibold text-foreground">
                    City
                  </label>
                  <div className="relative">
                    <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="city"
                      value={profile.city}
                      onChange={(e) => setProfile({ ...profile, city: e.target.value })}
                      className="pl-10"
                      placeholder="Nairobi"
                    />
                  </div>
                </div>
              </div>
              <div className="space-y-2">
                <label htmlFor="address" className="text-sm font-semibold text-foreground">
                  Default Delivery Address
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="address"
                    value={profile.defaultAddress}
                    onChange={(e) => setProfile({ ...profile, defaultAddress: e.target.value })}
                    className="pl-10"
                    placeholder="e.g. 123 Kenyatta Avenue, Suite 5"
                  />
                </div>
              </div>
              <div className="flex justify-end pt-2">
                <Button type="submit" disabled={profilePending} className="gap-2">
                  {profilePending ? (
                    <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                  ) : (
                    <><Save className="h-4 w-4" /> Save Changes</>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Notifications Tab */}
      <TabsContent value="notifications">
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Notification Preferences</CardTitle>
            </div>
            <CardDescription>
              Choose how and when you want to hear from us.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            {/* Channels */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Notification Channels</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Email Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via email</p>
                    </div>
                  </div>
                  <Toggle
                    id="notif-email"
                    enabled={notifications.email}
                    onChange={(v) => setNotifications({ ...notifications, email: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Smartphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">SMS Notifications</p>
                      <p className="text-xs text-muted-foreground">Receive updates via SMS</p>
                    </div>
                  </div>
                  <Toggle
                    id="notif-sms"
                    enabled={notifications.sms}
                    onChange={(v) => setNotifications({ ...notifications, sms: v })}
                  />
                </div>
              </div>
            </div>

            {/* Types */}
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-3">Notification Types</h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Package className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Order Updates</p>
                      <p className="text-xs text-muted-foreground">Shipping confirmations, delivery status</p>
                    </div>
                  </div>
                  <Toggle
                    id="notif-orders"
                    enabled={notifications.orderUpdates}
                    onChange={(v) => setNotifications({ ...notifications, orderUpdates: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Megaphone className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Promotions & Deals</p>
                      <p className="text-xs text-muted-foreground">Sales, discounts, and special offers</p>
                    </div>
                  </div>
                  <Toggle
                    id="notif-promos"
                    enabled={notifications.promotions}
                    onChange={(v) => setNotifications({ ...notifications, promotions: v })}
                  />
                </div>
                <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                  <div className="flex items-center gap-3">
                    <Newspaper className="h-5 w-5 text-primary" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">Newsletters</p>
                      <p className="text-xs text-muted-foreground">Weekly highlights and curated picks</p>
                    </div>
                  </div>
                  <Toggle
                    id="notif-newsletter"
                    enabled={notifications.newsletters}
                    onChange={(v) => setNotifications({ ...notifications, newsletters: v })}
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handleNotificationSave} disabled={notifPending} className="gap-2">
                {notifPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Preferences</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Privacy Tab */}
      <TabsContent value="privacy">
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Privacy Controls</CardTitle>
            </div>
            <CardDescription>
              Manage how your data is used and who can see your profile.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-6">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Eye className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Public Profile</p>
                    <p className="text-xs text-muted-foreground">Allow others to see your profile information</p>
                  </div>
                </div>
                <Toggle
                  id="privacy-profile"
                  enabled={privacy.showProfile}
                  onChange={(v) => setPrivacy({ ...privacy, showProfile: v })}
                />
              </div>
              <div className="flex items-center justify-between p-4 bg-background border border-border/50 rounded-xl">
                <div className="flex items-center gap-3">
                  <Database className="h-5 w-5 text-primary" />
                  <div>
                    <p className="text-sm font-semibold text-foreground">Data Collection</p>
                    <p className="text-xs text-muted-foreground">Help us improve by collecting usage data</p>
                  </div>
                </div>
                <Toggle
                  id="privacy-data"
                  enabled={privacy.dataCollection}
                  onChange={(v) => setPrivacy({ ...privacy, dataCollection: v })}
                />
              </div>
            </div>

            <div className="rounded-xl bg-muted/50 border border-border/50 p-4 text-sm text-muted-foreground space-y-2">
              <p className="font-semibold text-foreground flex items-center gap-2">
                <Shield className="h-4 w-4 text-primary" /> Your Privacy Matters
              </p>
              <p>
                We take your data seriously. Your information is encrypted and never shared with third parties
                without your explicit consent. You can request a copy of your data or ask us to delete it at any time
                by contacting our support team.
              </p>
            </div>

            <div className="flex justify-end pt-2">
              <Button onClick={handlePrivacySave} disabled={privacyPending} className="gap-2">
                {privacyPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
                ) : (
                  <><Save className="h-4 w-4" /> Save Preferences</>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      </TabsContent>

      {/* Account Tab */}
      <TabsContent value="account">
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-destructive" />
              <CardTitle className="text-base">Account Management</CardTitle>
            </div>
            <CardDescription>
              Review your account details and take actions regarding your account.
            </CardDescription>
          </CardHeader>
          <CardContent className="pt-6 space-y-8">
            {/* Account Info */}
            <div className="space-y-3">
              <h4 className="text-sm font-semibold text-foreground">Account Details</h4>
              <div className="grid sm:grid-cols-2 gap-4">
                <div className="p-4 bg-background border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-medium">Account Type</p>
                  <p className="text-sm font-semibold text-foreground mt-1 capitalize">Buyer</p>
                </div>
                <div className="p-4 bg-background border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-medium">Email</p>
                  <p className="text-sm font-semibold text-foreground mt-1">{userEmail}</p>
                </div>
                <div className="p-4 bg-background border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-medium">Member Since</p>
                  <p className="text-sm font-semibold text-foreground mt-1">Registered</p>
                </div>
                <div className="p-4 bg-background border border-border/50 rounded-xl">
                  <p className="text-xs text-muted-foreground font-medium">Account Status</p>
                  <p className="text-sm font-semibold text-emerald-500 mt-1 flex items-center gap-1.5">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 inline-block" />
                    Active
                  </p>
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="rounded-xl border border-destructive/20 bg-destructive/5 p-5 space-y-4">
              <div className="flex items-center gap-2">
                <Trash2 className="h-5 w-5 text-destructive" />
                <h4 className="text-sm font-bold text-destructive">Danger Zone</h4>
              </div>
              <p className="text-sm text-muted-foreground">
                Once you delete your account, there is no going back. Please be certain. All your orders,
                preferences, and personal data will be permanently removed.
              </p>
              <div className="flex gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-destructive/30 text-destructive hover:bg-destructive/10"
                  disabled
                >
                  <Trash2 className="h-4 w-4 mr-1.5" />
                  Delete My Account
                </Button>
                <span className="text-xs text-muted-foreground self-center">Coming soon</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}
