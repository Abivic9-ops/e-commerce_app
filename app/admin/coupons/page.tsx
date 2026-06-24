'use client';

import React, { useState, useEffect, useTransition } from 'react';
import { Ticket, Plus, Trash2, ToggleLeft, ToggleRight, Loader2, Tag } from 'lucide-react';
import { getCoupons, createCoupon, toggleCouponStatus, deleteCoupon } from '@/app/actions/coupons';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { formatKES } from '@/lib/utils';
import { toast } from 'sonner';

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [isPending, startTransition] = useTransition();

  // Form state
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'flat'>('percentage');
  const [discountValue, setDiscountValue] = useState('');
  const [minAmount, setMinAmount] = useState('');

  useEffect(() => {
    getCoupons().then((data) => {
      setCoupons(data);
      setLoading(false);
    });
  }, []);

  function handleCreate(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || !discountValue) return;

    startTransition(async () => {
      const result = await createCoupon({
        code,
        discountType,
        discountValue: parseFloat(discountValue),
        minAmount: minAmount ? parseFloat(minAmount) : undefined,
      });

      if (result.success) {
        toast.success(`Coupon "${code.toUpperCase()}" created!`);
        setCode(''); setDiscountValue(''); setMinAmount('');
        setShowForm(false);
        getCoupons().then(setCoupons);
      } else {
        toast.error(result.error || 'Failed to create coupon');
      }
    });
  }

  function handleToggle(id: string, current: boolean) {
    startTransition(async () => {
      const result = await toggleCouponStatus(id, !current);
      if (result.success) {
        setCoupons((prev) => prev.map((c) => c._id === id ? { ...c, active: !current } : c));
        toast.success(`Coupon ${!current ? 'activated' : 'deactivated'}`);
      } else {
        toast.error('Failed to update coupon');
      }
    });
  }

  function handleDelete(id: string, code: string) {
    if (!confirm(`Delete coupon "${code}"?`)) return;
    startTransition(async () => {
      const result = await deleteCoupon(id);
      if (result.success) {
        setCoupons((prev) => prev.filter((c) => c._id !== id));
        toast.success('Coupon deleted');
      } else {
        toast.error('Failed to delete coupon');
      }
    });
  }

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight">Coupons</h1>
          <p className="text-sm text-muted-foreground">Create and manage discount codes for customers.</p>
        </div>
        <Button size="sm" className="gap-1.5 self-start sm:self-auto" onClick={() => setShowForm(!showForm)}>
          <Plus className="h-4 w-4" />
          New Coupon
        </Button>
      </div>

      {/* Create Form */}
      {showForm && (
        <Card className="border-primary/20 bg-primary/5 animate-in fade-in slide-in-from-top-2 duration-300">
          <CardHeader className="pb-4">
            <CardTitle className="text-base">Create New Coupon</CardTitle>
            <CardDescription>All fields marked * are required.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreate} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase())}
                  placeholder="e.g. SAVE20"
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground font-mono uppercase placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Discount Type *</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="percentage">Percentage (%)</option>
                  <option value="flat">Flat Amount (KES)</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Discount Value *</label>
                <input
                  type="number"
                  required
                  min={1}
                  max={discountType === 'percentage' ? 100 : undefined}
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder={discountType === 'percentage' ? '20 (= 20% off)' : '500 (= KES 500 off)'}
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-foreground">Min. Order Amount (KES)</label>
                <input
                  type="number"
                  min={0}
                  value={minAmount}
                  onChange={(e) => setMinAmount(e.target.value)}
                  placeholder="e.g. 2000 (optional)"
                  className="w-full px-3 py-2.5 bg-background border border-border rounded-xl text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="sm:col-span-2 flex gap-3 justify-end pt-2">
                <Button type="button" variant="outline" size="sm" onClick={() => setShowForm(false)}>Cancel</Button>
                <Button type="submit" size="sm" disabled={isPending} className="gap-1.5">
                  {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Tag className="h-4 w-4" />}
                  Create Coupon
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Coupons List */}
      <Card className="border-border/50 bg-card/45 backdrop-blur-xs overflow-hidden">
        <div className="overflow-x-auto">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : coupons.length === 0 ? (
            <div className="py-20 text-center text-muted-foreground text-sm">
              <Ticket className="h-10 w-10 mx-auto mb-3 opacity-30" />
              No coupons yet. Create your first discount code.
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border/50 bg-secondary/20">
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Code</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Type</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Discount</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Min. Order</th>
                  <th className="text-left py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Status</th>
                  <th className="text-right py-3 px-4 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/30">
                {coupons.map((coupon) => (
                  <tr key={coupon._id} className="hover:bg-secondary/20 transition-colors">
                    <td className="py-3 px-4">
                      <span className="font-mono font-bold text-foreground bg-secondary/50 px-2.5 py-1 rounded-lg text-sm">{coupon.code}</span>
                    </td>
                    <td className="py-3 px-4">
                      <span className="capitalize text-muted-foreground text-xs">{coupon.discountType}</span>
                    </td>
                    <td className="py-3 px-4 font-bold text-primary">
                      {coupon.discountType === 'percentage' ? `${coupon.discountValue}%` : formatKES(coupon.discountValue)}
                    </td>
                    <td className="py-3 px-4 text-muted-foreground text-xs hidden md:table-cell">
                      {coupon.minAmount ? formatKES(coupon.minAmount) : '—'}
                    </td>
                    <td className="py-3 px-4">
                      <Badge
                        variant="outline"
                        className={coupon.active
                          ? 'bg-emerald-500/10 text-emerald-500 border-emerald-500/30'
                          : 'bg-secondary/50 text-muted-foreground border-border/50'}
                      >
                        {coupon.active ? 'Active' : 'Inactive'}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center justify-end gap-1">
                        <button
                          onClick={() => handleToggle(coupon._id, coupon.active)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg hover:bg-secondary text-muted-foreground hover:text-foreground transition-colors"
                          title={coupon.active ? 'Deactivate' : 'Activate'}
                        >
                          {coupon.active
                            ? <ToggleRight className="h-5 w-5 text-emerald-500" />
                            : <ToggleLeft className="h-5 w-5" />}
                        </button>
                        <button
                          onClick={() => handleDelete(coupon._id, coupon.code)}
                          disabled={isPending}
                          className="p-1.5 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
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
