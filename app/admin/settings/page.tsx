import React from 'react';
import { Settings, Store, CreditCard, Bell, Shield, Globe, Info } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export const metadata = {
  title: 'Settings - ShopEasy Admin',
  description: 'Configure your store settings.',
};

export default function AdminSettingsPage() {
  const envVars = [
    { key: 'MONGODB_URI', label: 'MongoDB Connection', group: 'Database', icon: '🗄️', hint: 'Your MongoDB Atlas connection string.' },
    { key: 'NEXT_PUBLIC_SUPABASE_URL', label: 'Supabase Project URL', group: 'Authentication', icon: '🔑', hint: 'Your Supabase project URL.' },
    { key: 'NEXT_PUBLIC_SUPABASE_ANON_KEY', label: 'Supabase Anon Key', group: 'Authentication', icon: '🔑', hint: 'Public anon key for client-side auth.' },
    { key: 'MPESA_CONSUMER_KEY', label: 'M-Pesa Consumer Key', group: 'Payments', icon: '💳', hint: 'Daraja API consumer key from Safaricom developer portal.' },
    { key: 'MPESA_CONSUMER_SECRET', label: 'M-Pesa Consumer Secret', group: 'Payments', icon: '💳', hint: 'Keep this secret. Never expose in client-side code.' },
    { key: 'MPESA_PASSKEY', label: 'M-Pesa Passkey', group: 'Payments', icon: '💳', hint: 'Lipa Na M-Pesa passkey from Daraja portal.' },
    { key: 'MPESA_SHORTCODE', label: 'M-Pesa Shortcode', group: 'Payments', icon: '💳', hint: 'Your business till or paybill number.' },
    { key: 'MPESA_CALLBACK_URL', label: 'M-Pesa Callback URL', group: 'Payments', icon: '🔗', hint: 'Public URL for receiving M-Pesa payment callbacks (must be HTTPS).' },
  ];

  const groups = [...new Set(envVars.map((e) => e.group))];

  const groupIcons: Record<string, React.ReactNode> = {
    Database: <Store className="h-4 w-4" />,
    Authentication: <Shield className="h-4 w-4" />,
    Payments: <CreditCard className="h-4 w-4" />,
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Settings</h1>
        <p className="text-sm text-muted-foreground">
          Store configuration, environment variables, and integration status.
        </p>
      </div>

      {/* Store Info Card */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-xs">
        <CardHeader className="border-b border-border/50 pb-4">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" />
            <CardTitle className="text-base">Store Identity</CardTitle>
          </div>
          <CardDescription>Basic information about your store.</CardDescription>
        </CardHeader>
        <CardContent className="pt-5 grid sm:grid-cols-2 gap-6">
          {[
            { label: 'Store Name', value: 'ShopEasy' },
            { label: 'Currency', value: 'KES (Kenyan Shilling)' },
            { label: 'Country', value: 'Kenya 🇰🇪' },
            { label: 'Shipping Fee', value: 'KES 350 (flat rate)' },
            { label: 'Auth Provider', value: 'Supabase' },
            { label: 'Database', value: 'MongoDB (Mongoose)' },
            { label: 'Payment Gateway', value: 'Safaricom M-Pesa Daraja API' },
            { label: 'Deployment', value: 'Vercel / Next.js 15' },
          ].map((item) => (
            <div key={item.label} className="space-y-1">
              <p className="text-xs text-muted-foreground font-medium">{item.label}</p>
              <p className="text-sm font-semibold text-foreground">{item.value}</p>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Environment Variables Reference */}
      {groups.map((group) => (
        <Card key={group} className="border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center gap-2">
              <span className="text-primary">{groupIcons[group]}</span>
              <CardTitle className="text-base">{group} Variables</CardTitle>
            </div>
            <CardDescription>Configure these in your <code className="text-foreground">.env.local</code> file.</CardDescription>
          </CardHeader>
          <CardContent className="pt-5 space-y-4">
            {envVars.filter((e) => e.group === group).map((envVar) => (
              <div key={envVar.key} className="flex flex-col sm:flex-row sm:items-start gap-2 sm:gap-6 p-3 bg-background border border-border/50 rounded-xl">
                <div className="flex-1 min-w-0">
                  <p className="font-mono text-sm font-bold text-primary break-all">{envVar.icon} {envVar.key}</p>
                  <p className="text-xs text-muted-foreground mt-0.5">{envVar.hint}</p>
                </div>
                <Badge variant="outline" className="border-border/60 self-start shrink-0 text-[10px]">Required</Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      ))}

      {/* M-Pesa Simulator Notice */}
      <Card className="border-amber-500/20 bg-amber-500/5">
        <CardHeader className="border-b border-amber-500/10 pb-4">
          <div className="flex items-center gap-2">
            <Info className="h-4 w-4 text-amber-500" />
            <CardTitle className="text-base text-amber-600 dark:text-amber-400">Simulator Mode Notice</CardTitle>
          </div>
        </CardHeader>
        <CardContent className="pt-5 space-y-3 text-sm text-muted-foreground">
          <p>
            When <code className="text-foreground font-mono text-xs">MPESA_CONSUMER_KEY</code> or <code className="text-foreground font-mono text-xs">MPESA_CONSUMER_SECRET</code> are set to placeholder values, the payment system automatically enters <strong className="text-foreground">Simulator Mode</strong>.
          </p>
          <p>
            In simulator mode, the STK Push route creates a <code className="text-foreground font-mono text-xs">pending</code> order and automatically calls the callback after <strong className="text-foreground">3 seconds</strong> to confirm payment — without contacting the real Safaricom Daraja API.
          </p>
          <p>
            To activate live payments, set real Safaricom Daraja API credentials from{' '}
            <a href="https://developer.safaricom.co.ke" target="_blank" rel="noopener noreferrer" className="text-primary underline underline-offset-2">
              developer.safaricom.co.ke
            </a>.
          </p>
        </CardContent>
      </Card>

      {/* Notification placeholder */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-xs opacity-60">
        <CardHeader className="pb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base text-muted-foreground">Notifications</CardTitle>
            <Badge variant="outline" className="text-[10px] border-border/50 ml-auto">Coming Soon</Badge>
          </div>
          <CardDescription>Email alerts for new orders, low stock, and payment failures. (Planned: Resend integration)</CardDescription>
        </CardHeader>
      </Card>
    </div>
  );
}
