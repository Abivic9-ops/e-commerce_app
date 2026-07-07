'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Search, Filter, ChevronDown, Eye, Loader2, Wallet, TrendingUp, Clock, XCircle, CheckCircle } from 'lucide-react';
import { getOrders, getPaymentStats, reconcilePayment } from '@/app/actions/orders';
import { formatKES } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { toast } from 'sonner';

const paymentColor: Record<string, string> = {
  pending: 'bg-amber-500/10 text-amber-500 border-amber-500/30',
  paid: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30',
  failed: 'bg-rose-500/10 text-rose-500 border-rose-500/30',
};

export default function AdminPaymentsClient() {
  const [orders, setOrders] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCollected: 0, paidCount: 0, pendingCount: 0, failedCount: 0, successRate: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    Promise.all([getOrders(), getPaymentStats()]).then(([ordersData, statsData]) => {
      setOrders(ordersData);
      setStats(statsData);
      setLoading(false);
    });
  }, []);

  function handlePaymentUpdate(orderId: string, paymentStatus: 'paid' | 'failed') {
    startTransition(async () => {
      const result = await reconcilePayment(orderId, paymentStatus);
      if (result.success) {
        setOrders((prev) => prev.map((o) => o._id === orderId ? { ...o, paymentStatus } : o));
        toast.success(`Payment marked as "${paymentStatus}"`);
      } else {
        toast.error('Failed to update payment status');
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
      statusFilter === 'all' || o.paymentStatus === statusFilter;
    return matchSearch && matchStatus;
  });

  const kpiCards = [
    {
      label: 'Total Collected',
      value: formatKES(stats.totalCollected),
      icon: Wallet,
      color: 'text-emerald-500 bg-emerald-500/10',
      description: 'From paid orders',
    },
    {
      label: 'Success Rate',
      value: `${stats.successRate}%`,
      icon: TrendingUp,
      color: 'text-blue-500 bg-blue-500/10',
      description: `${stats.paidCount} paid · ${stats.paidCount + stats.failedCount + stats.pendingCount} total`,
    },
    {
      label: 'Pending',
      value: stats.pendingCount,
      icon: Clock,
      color: 'text-amber-500 bg-amber-500/10',
      description: 'Awaiting payment',
    },
    {
      label: 'Failed',
      value: stats.failedCount,
      icon: XCircle,
      color: 'text-rose-500 bg-rose-500/10',
      description: 'Payment declined',
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Payments</h1>
          <p className="text-sm text-muted-foreground">Track, reconcile, and monitor all payment transactions.</p>
        </div>
        <Badge variant="outline" className="border-border/60 self-start sm:self-auto">
          {filtered.length} transaction{filtered.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      {/* KPI Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {kpiCards.map((s) => {
          const Icon = s.icon;
          return (
            <Card key={s.label} className="border-border/50 bg-card/45 backdrop-blur-xs">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <span className="text-xs font-medium text-muted-foreground">{s.label}</span>
                <div className={`p-2 rounded-xl ${s.color}`}><Icon className="h-4 w-4" /></div>
              </CardHeader>
              <CardContent className="space-y-1">
                <div className="text-2xl font-bold">{s.value}</div>
                <p className="text-[10px] text-muted-foreground">{s.description}</p>
              </CardContent>
            </Card>
          );
        })}
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
            <option value="paid">Paid</option>
            <option value="pending">Pending</option>
            <option value="failed">Failed</option>
          </select>
          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        </div>
      </div>

      {/* Transactions Table */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-xs overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              <Wallet className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No transactions found.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Order ID</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Customer</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Date</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Amount</th>
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
                        <td colSpan={6} className="bg-secondary/10 px-4 py-4 border-b border-border/30">
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                              <div>
                                <p className="text-xs text-muted-foreground">Subtotal</p>
                                <p className="font-semibold">{formatKES(order.subtotal)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Shipping</p>
                                <p className="font-semibold">{formatKES(order.shippingFee)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Total</p>
                                <p className="font-bold text-primary">{formatKES(order.total)}</p>
                              </div>
                              <div>
                                <p className="text-xs text-muted-foreground">Delivery</p>
                                <p className="font-semibold capitalize">{order.deliveryStatus}</p>
                              </div>
                              {order.mpesaDetails?.ReceiptNumber && (
                                <div>
                                  <p className="text-xs text-muted-foreground">M-Pesa Receipt</p>
                                  <p className="font-mono font-semibold text-xs">{order.mpesaDetails.ReceiptNumber}</p>
                                </div>
                              )}
                              {order.mpesaDetails?.transactionDate && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Transaction Date</p>
                                  <p className="font-semibold text-xs">
                                    {new Date(order.mpesaDetails.transactionDate).toLocaleString('en-KE')}
                                  </p>
                                </div>
                              )}
                              {order.mpesaDetails?.phoneNumber && (
                                <div>
                                  <p className="text-xs text-muted-foreground">Payer Phone</p>
                                  <p className="font-semibold text-xs">{order.mpesaDetails.phoneNumber}</p>
                                </div>
                              )}
                            </div>

                            {/* Manual Reconciliation */}
                            {order.paymentStatus === 'pending' && (
                              <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-border/40">
                                <span className="text-xs font-semibold text-muted-foreground">Reconcile:</span>
                                <button
                                  onClick={() => handlePaymentUpdate(order._id, 'paid')}
                                  disabled={isPending}
                                  className="text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-emerald-500/10 text-emerald-600 border-emerald-500/30 hover:bg-emerald-500/20"
                                >
                                  <CheckCircle className="h-3 w-3 inline mr-1" />
                                  Mark as Paid
                                </button>
                                <button
                                  onClick={() => handlePaymentUpdate(order._id, 'failed')}
                                  disabled={isPending}
                                  className="text-xs px-3 py-1.5 rounded-lg border font-medium capitalize transition-all disabled:opacity-50 disabled:cursor-not-allowed bg-rose-500/10 text-rose-600 border-rose-500/30 hover:bg-rose-500/20"
                                >
                                  <XCircle className="h-3 w-3 inline mr-1" />
                                  Mark as Failed
                                </button>
                              </div>
                            )}
                            {order.paymentStatus === 'paid' && (
                              <div className="flex items-center gap-2 pt-2 border-t border-border/40">
                                <Badge variant="outline" className="border-emerald-500/30 text-emerald-500 bg-emerald-500/10 gap-1">
                                  <CheckCircle className="h-3 w-3" />
                                  Payment Completed
                                </Badge>
                              </div>
                            )}
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
