import React from 'react';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowUpRight, 
  ArrowDownRight,
  ShieldCheck,
  CreditCard,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatKES } from '@/lib/utils';

export default function AdminPage() {
  // Mock KPIs for visualization before Phase 8 dynamic database binding
  const stats = [
    {
      title: 'Total Sales',
      value: formatKES(142500),
      description: '+12.5% from last week',
      trend: 'up',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10',
    },
    {
      title: 'Active Catalog',
      value: '10 Products',
      description: 'Across 3 categories',
      trend: 'neutral',
      icon: Package,
      color: 'text-blue-500 bg-blue-500/10',
    },
    {
      title: 'Pending Orders',
      value: '3 Orders',
      description: 'Awaiting fulfillment',
      trend: 'up',
      icon: ShoppingBag,
      color: 'text-amber-500 bg-amber-500/10',
    },
    {
      title: 'Customers',
      value: '18 users',
      description: 'Registered accounts',
      trend: 'up',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10',
    },
  ];

  // Mock activity logs (mostly M-Pesa sandbox & user operations for learning)
  const activityLogs = [
    {
      id: 'log-1',
      action: 'M-Pesa Callback Success',
      details: 'STK Push of KES 2,500 confirmed (Transaction ID: NLX812H7D9)',
      time: '12 mins ago',
      status: 'success',
    },
    {
      id: 'log-2',
      action: 'Product Stock Alert',
      details: 'Product "Premium Leather Jacket" reached low stock warning (2 left)',
      time: '45 mins ago',
      status: 'warning',
    },
    {
      id: 'log-3',
      action: 'New Admin Registered',
      details: 'Account admin@shopeasy.co.ke added to admin role metadata',
      time: '2 hours ago',
      status: 'info',
    },
    {
      id: 'log-4',
      action: 'M-Pesa STK Push Initialized',
      details: 'Checkout request sent to 254712345678 for KES 5,400',
      time: '3 hours ago',
      status: 'info',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header and Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Monitor transaction status, stock tracking, and user registrations.
          </p>
        </div>
        
        {/* Placeholder Quick Action buttons */}
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="border-border">
            Export Logs
          </Button>
          <Button size="sm" className="gap-1.5">
            <Plus className="h-4 w-4" />
            <span>Add Product</span>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Card key={stat.title} className="border-border/50 bg-card/45 backdrop-blur-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                <div className={`p-2 rounded-xl ${stat.color}`}>
                  <Icon className="h-4.5 w-4.5" />
                </div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                <div className="flex items-center gap-1 text-xs text-muted-foreground">
                  {stat.trend === 'up' && (
                    <span className="flex items-center text-emerald-500 font-medium">
                      <ArrowUpRight className="h-3 w-3 mr-0.5" />
                    </span>
                  )}
                  {stat.trend === 'down' && (
                    <span className="flex items-center text-rose-500 font-medium">
                      <ArrowDownRight className="h-3 w-3 mr-0.5" />
                    </span>
                  )}
                  <span>{stat.description}</span>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Grid of System State Details */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent M-Pesa Callback Logs / System Activity */}
        <Card className="lg:col-span-2 border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Activities</CardTitle>
                <CardDescription>System log of M-Pesa callbacks & product catalog actions</CardDescription>
              </div>
              <Badge variant="outline" className="border-border/60">Live feed</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              {activityLogs.map((log) => (
                <div key={log.id} className="flex gap-4 items-start text-sm">
                  <div className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    log.status === 'success' 
                      ? 'bg-emerald-500' 
                      : log.status === 'warning'
                      ? 'bg-amber-500'
                      : 'bg-indigo-500'
                  }`} />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-foreground">{log.action}</p>
                      <span className="text-xs text-muted-foreground">{log.time}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">{log.details}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Setup and Tutorial Card (to teach the graduate) */}
        <Card className="border-border/50 bg-card/45 backdrop-blur-xs flex flex-col justify-between">
          <CardHeader>
            <div className="flex items-center gap-2 mb-2 text-primary">
              <ShieldCheck className="h-5 w-5" />
              <span className="font-bold text-xs uppercase tracking-wider">Dev Setup Guide</span>
            </div>
            <CardTitle className="text-lg">Promote to Admin</CardTitle>
            <CardDescription>
              How to assign administrative privileges to a user account.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 text-xs text-muted-foreground leading-relaxed">
            <p>
              Supabase Auth handles identity. The Next.js middleware guards `/admin/**` by looking for:
            </p>
            <code className="block p-3 rounded-xl bg-background border border-border font-mono text-[10px] text-foreground">
              user.user_metadata.role === 'admin'
            </code>
            <p>
              To promote a registered buyer account to admin during development, you can use the Supabase Studio CLI / Database dashboard to execute:
            </p>
            <pre className="p-3 rounded-xl bg-background border border-border font-mono text-[10px] text-foreground overflow-x-auto">
{`UPDATE auth.users 
SET raw_user_meta_data = 
  raw_user_meta_data || '{"role": "admin"}'
WHERE email = 'admin@example.com';`}
            </pre>
          </CardContent>
        </Card>
      </div>

    </div>
  );
}
