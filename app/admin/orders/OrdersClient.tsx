'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Filter, ChevronDown, Eye, Truck, CheckCircle2, Package, Loader2 } from 'lucide-react';
import { getOrders, updateOrderStatus } from '@/app/actions/orders';
import { formatKES } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { toast } from 'sonner';

const DELIVERY_STATUSES = ['placed', 'processing', 'shipped', 'delivered'];

const deliveryColor: Record<string, string> = {
  placed: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  processing: 'bg-blue-500/10 text-blue-500 border-blue-500/30',
  shipped: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/30',
  delivered: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
};
const paymentColor: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
};

export default function AdminOrdersClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  function handleStatusUpdate(orderId: string, deliveryStatus: string) {
    startTransition(async () => {
      const result = await updateOrderStatus(orderId, deliveryStatus);
      if (result.success) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, deliveryStatus } : o));
        toast.success(`Order status updated to "${deliveryStatus}"`);
      } else {
        toast.error('Failed to update order status');
      }
    });
  }

  const filtered = orders.filter((o) => {
    const matchSearch =
      !search ||
      o.orderId?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerDetails?.fullName?.toLowerCase().includes(search.toLowerCase()) ||
      o.customerDetails?.phone?.includes(search);
    const matchStatus =
      statusFilter === 'all' || o.deliveryStatus === statusFilter || o.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Orders</h1>
          <p className="text-sm text-muted-foreground">Manage, filter, and update all customer orders.</p>
        </div>
        <Badge variant="outline" className="border-border/60 self-start sm:self-auto">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search by order ID, name, or phone..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary transition-all"
          />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="pl-9 pr-8 py-2.5 bg-card border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary appearance-none cursor-pointer"
          >
            <option value="all">All Statuses</option>
            <option value="placed">Placed</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="paid">Paid</option>
            <option value="pending">Pending Payment</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Orders Table */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-xs overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No orders found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Payment</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Delivery</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Total</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {filtered.map((order) => (
                  <React.Fragment key={order._id}>
                    <tr
                      className="hover:bg-secondary/20 transition-colors cursor-pointer"
                      onClick={() => setExpandedId(expandedId === order._id ? null : order._id)}
                    >
                      <td className="py-3 px-4 font-mono text-xs font-semibold text-foreground">{order.orderId}</td>
                      <td className="py-3 px-4 hidden sm:table-cell">
                        <div>
                          <p className="font-medium text-foreground">{order.customerDetails?.fullName}</p>
                          <p className="text-xs text-muted-foreground">{order.customerDetails?.phone}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4 text-muted-foreground hidden md:table-cell text-xs">
                        {new Date(order.createdAt).toLocaleDateString('en-KE', { day: 'numeric', month: 'short', year: 'numeric' })}
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${paymentColor[order.paymentStatus] || ''}`}>
                          {order.paymentStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded-full border capitalize ${deliveryColor[order.deliveryStatus] || ''}`}>
                          {order.deliveryStatus}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-primary text-right hidden sm:table-cell">{formatKES(order.total)}</td>
                      <td className="py-3 px-4">
                        <div className="flex justify-end">
                          <button
                            onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === order._id ? null : order._id); }}
                            className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          >
                            <Eye className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                    {expandedId === order._id && (
                      <tr>
                        <td colSpan={7} className="bg-secondary/10 px-4 py-4 border-b border-border/30">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Address</p>
                                <p className="font-semibold">{order.customerDetails?.address}, {order.customerDetails?.city}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Items</p>
                                <p className="font-semibold">{order.items?.length ?? 0} item(s)</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Shipping</p>
                                <p className="font-semibold">{formatKES(order.shippingFee)}</p>
                              </div>
                              {order.paystackDetails?.receiptNumber && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Paystack Ref</p>
                                  <p className="font-mono font-semibold text-xs">{order.paystackDetails.receiptNumber}</p>
                                </div>
                              )}
                            </div>

                            {/* Items list */}
                            <div className="flex flex-wrap gap-2">
                              {order.items?.map((item: any, i: number) => (
                                <span key={i} className="text-xs px-3 py-1 bg-background border border-border rounded-lg text-foreground">
                                  {item.name} ×{item.quantity}
                                </span>
                              ))}
                            </div>

                            {/* Status Update Actions */}
                            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                              <span className="text-xs font-semibold text-muted-foreground">Update Delivery:</span>
                              {DELIVERY_STATUSES.map((s) => (
                                <button
                                  key={s}
                                  onClick={() => handleStatusUpdate(order._id, s)}
                                  disabled={isPending || order.deliveryStatus === s}
                                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed ${
                                    order.deliveryStatus === s
                                      ? 'bg-primary text-primary-foreground border-primary'
                                      : 'bg-background hover:bg-secondary border-border text-foreground'
                                  }`}
                                >
                                  {s === 'shipped' ? <Truck className="h-3 w-3 inline mr-1" /> : s === 'delivered' ? <CheckCircle2 className="h-3 w-3 inline mr-1" /> : null}
                                  {s}
                                </button>
                              ))}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </Card>
    </div>
  );
}
