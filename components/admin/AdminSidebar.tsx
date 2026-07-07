'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  ShoppingCart, 
  Users, 
  MessageSquare, 
  Ticket, 
  Settings, 
  Store,
  ShieldAlert,
  Wallet
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AdminSidebarProps {
  className?: string;
  onLinkClick?: () => void;
}

export function AdminSidebar({ className, onLinkClick }: AdminSidebarProps) {
  const pathname = usePathname();

  const navigation = [
    { name: 'Overview', href: '/admin', icon: LayoutDashboard },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Payments', href: '/admin/payments', icon: Wallet },
    { name: 'Customers', href: '/admin/customers', icon: Users },
    { name: 'Reviews', href: '/admin/reviews', icon: MessageSquare },
    { name: 'Coupons', href: '/admin/coupons', icon: Ticket },
    { name: 'Settings', href: '/admin/settings', icon: Settings },
  ];

  return (
    <aside className={cn('flex flex-col bg-card border-r border-border h-screen sticky top-0', className)}>
      {/* Sidebar Brand Header */}
      <div className="h-16 flex items-center px-6 border-b border-border">
        <Link 
          href="/admin" 
          className="flex items-center gap-2 font-bold text-lg bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent"
          onClick={onLinkClick}
        >
          <ShieldAlert className="h-5 w-5 text-primary" />
          <span>ShopEasy Admin</span>
        </Link>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase px-3 mb-2">
          Management
        </div>
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin' && pathname.startsWith(item.href));
          const Icon = item.icon;

          return (
            <Link
              key={item.name}
              href={item.href}
              onClick={onLinkClick}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group duration-150',
                isActive 
                  ? 'bg-primary text-primary-foreground shadow-md shadow-primary/10' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <Icon className={cn('h-4.5 w-4.5', isActive ? 'text-primary-foreground' : 'text-muted-foreground group-hover:text-foreground')} />
              <span>{item.name}</span>
            </Link>
          );
        })}
      </nav>

      {/* Footer link to storefront */}
      <div className="p-4 border-t border-border bg-background/30">
        <Link
          href="/"
          className="flex items-center justify-center gap-2 w-full px-3 py-2.5 rounded-xl border border-border bg-card text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-muted-foreground/30 transition-all text-center"
        >
          <Store className="h-4 w-4" />
          <span>View Storefront</span>
        </Link>
      </div>
    </aside>
  );
}
