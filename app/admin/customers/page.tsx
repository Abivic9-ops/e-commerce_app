import React from 'react';
import { connectToDatabase } from '@/lib/db/mongoose';
import { Order } from '@/lib/db/models/Order';
import { requireRole } from '@/lib/supabase/auth';
import { Users, Phone, MapPin, ShoppingBag, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { formatKES } from '@/lib/utils';

export const metadata = {
  title: 'Customers - ShopEasy Admin',
  description: 'View customer analytics from order data.',
};

async function getCustomerData() {
  await connectToDatabase();

  // Aggregate customer data from orders
  const customerAgg = await Order.aggregate([
    {
      $group: {
        _id: '$customerDetails.phone',
        fullName: { $last: '$customerDetails.fullName' },
        address: { $last: '$customerDetails.address' },
        city: { $last: '$customerDetails.city' },
        orderCount: { $sum: 1 },
        totalSpent: { $sum: '$total' },
        lastOrderDate: { $max: '$createdAt' },
        paymentStatuses: { $push: '$paymentStatus' },
      },
    },
    { $sort: { totalSpent: -1 } },
  ]);

  return JSON.parse(JSON.stringify(customerAgg));
}

export default async function AdminCustomersPage() {
  await requireRole('admin');
  const customers = await getCustomerData();

  const totalRevenue = customers.reduce((s: number, c: any) => s + c.totalSpent, 0);
  const totalOrders = customers.reduce((s: number, c: any) => s + c.orderCount, 0);

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div>
        <h1 className="text-3xl font-extrabold tracking-tight">Customers</h1>
        <p className="text-sm text-muted-foreground">Derived from order data — unique by phone number.</p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: 'Total Customers', value: customers.length, icon: Users, color: 'text-indigo-500 bg-indigo-500/10' },
          { label: 'Total Orders', value: totalOrders, icon: ShoppingBag, color: 'text-amber-500 bg-amber-500/10' },
          { label: 'Total Revenue', value: formatKES(totalRevenue), icon: TrendingUp, color: 'text-emerald-500 bg-emerald-500/10' },
          { label: 'Avg Order Value', value: totalOrders > 0 ? formatKES(Math.round(totalRevenue / totalOrders)) : 'KES 0', icon: TrendingUp, color: 'text-blue-500 bg-blue-500/10' },
        ].map((s) => (
          <Card key={s.label} className="border-border/50 bg-card/45 backdrop-blur-xs">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
              <div className={`p-2 rounded-xl ${s.color}`}><s.icon className="h-4 w-4" /></div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{s.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Customers Table */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-xs overflow-hidden">
        <CardHeader className="border-b border-border/50">
          <CardTitle>Customer List</CardTitle>
          <CardDescription>Ranked by total spend. All customers are automatically enrolled on first order.</CardDescription>
        </CardHeader>
        <div className="overflow-x-auto">
          {customers.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              <Users className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No customer data yet.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Location</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Orders</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Total Spent</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Last Order</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {customers.map((c: any) => (
                  <tr key={c._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <p className="font-semibold text-foreground">{c.fullName}</p>
                      <p className="text-xs text-muted-foreground flex items-center gap-1">
                        <Phone className="h-3 w-3" />{c._id}
                      </p>
                    </td>
                    <td className="py-3 px-4 hidden sm:table-cell">
                      <p className="text-muted-foreground text-xs flex items-center gap-1">
                        <MapPin className="h-3 w-3" />{c.city}
                      </p>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-bold text-foreground">{c.orderCount}</span>
                    </td>
                    <td className="py-3 px-4 text-right font-bold text-primary">{formatKES(c.totalSpent)}</td>
                    <td className="py-3 px-4 text-right text-xs text-muted-foreground hidden md:table-cell">
                      {new Date(c.lastOrderDate).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
