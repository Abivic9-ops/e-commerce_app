import React from 'react';
import Link from 'next/link';
import { 
  TrendingUp, 
  Package, 
  ShoppingBag, 
  Users, 
  ArrowUpRight,
  ShieldCheck,
  Plus,
  ArrowRight,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { formatKES } from '@/lib/utils';
import { getOrderStats } from '@/app/actions/orders';

export default async function AdminPage() {
  const { stats, recentOrders } = await getOrderStats();

  const kpiCards = [
    {
      title: 'Total Revenue',
      value: formatKES(stats.totalSales),
      description: 'From paid orders',
      icon: TrendingUp,
      color: 'text-emerald-500 bg-emerald-500/10',
      href: '/admin/orders?status=paid',
    },
    {
      title: 'Active Catalog',
      value: `${stats.activeProducts} Products`,
      description: 'In your store',
      icon: Package,
      color: 'text-blue-500 bg-blue-500/10',
      href: '/admin/products',
    },
    {
      title: 'Pending Orders',
      value: `${stats.pendingOrders} Orders`,
      description: 'Awaiting fulfillment',
      icon: ShoppingBag,
      color: 'text-amber-500 bg-amber-500/10',
      href: '/admin/orders',
    },
    {
      title: 'Customers',
      value: `${stats.customerCount} Unique`,
      description: 'By phone number',
      icon: Users,
      color: 'text-indigo-500 bg-indigo-500/10',
      href: '/admin/customers',
    },
  ];

  const deliveryStatusColor: Record<string, string> = {
    placed: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    processing: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
    shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
    delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  };

  const paymentStatusColor: Record<string, string> = {
    pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
    paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
    failed: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      
      {/* Header and Quick Actions */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Overview</h1>
          <p className="text-sm text-muted-foreground">
            Live data from MongoDB — revenue, stock, orders & customers.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button size="sm" variant="outline" className="border-border" asChild>
            <Link href="/admin/orders">View All Orders</Link>
          </Button>
          <Button size="sm" className="gap-1.5" asChild>
            <Link href="/admin/products">
              <Plus className="h-4 w-4" />
              <span>Add Product</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link key={stat.title} href={stat.href}>
              <Card className="border-border/50 bg-card/45 backdrop-blur-xs hover:border-primary/30 hover:shadow-md transition-all cursor-pointer group">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <span className="text-sm font-medium text-muted-foreground">{stat.title}</span>
                  <div className={`p-2 rounded-xl ${stat.color}`}>
                    <Icon className="h-4 w-4" />
                  </div>
                </CardHeader>
                <CardContent className="space-y-1">
                  <div className="text-2xl font-bold tracking-tight">{stat.value}</div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                    <span>{stat.description}</span>
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent Orders */}
        <Card className="lg:col-span-2 border-border/50 bg-card/45 backdrop-blur-xs">
          <CardHeader className="border-b border-border/50 pb-4">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg">Recent Orders</CardTitle>
                <CardDescription>Latest 5 orders from your store</CardDescription>
              </div>
              <Badge variant="outline" className="border-border/60">Live</Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-4">
            {recentOrders.length === 0 ? (
              <div className="py-10 text-center text-muted-foreground text-sm">
                No orders yet. They will appear here once customers checkout.
              </div>
            ) : (
              <div className="space-y-3">
                {recentOrders.map((order: any) => (
                  <div key={order._id} className="flex items-center gap-4 p-3 rounded-xl hover:bg-secondary/30 transition-colors group">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-foreground">{order.orderId}</p>
                      <p className="text-xs text-muted-foreground truncate">{order.customerDetails?.fullName} · {order.customerDetails?.phone}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${paymentStatusColor[order.paymentStatus] || ''}`}>
                        {order.paymentStatus}
                      </span>
                      <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${deliveryStatusColor[order.deliveryStatus] || ''}`}>
                        {order.deliveryStatus}
                      </span>
                      <span className="text-sm font-bold text-primary">{formatKES(order.total)}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
            <div className="mt-4 pt-4 border-t border-border/50">
              <Button variant="outline" size="sm" className="w-full gap-1.5" asChild>
                <Link href="/admin/orders">
                  View All Orders <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Admin Guide Card */}
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
              Supabase Auth handles identity. The middleware guards <code className="text-foreground">/admin/**</code> by looking for:
            </p>
            <code className="block p-3 rounded-xl bg-background border border-border font-mono text-[10px] text-foreground">
              user.user_metadata.role === 'admin'
            </code>
            <p>
              Run this SQL in Supabase Studio to promote a user:
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
