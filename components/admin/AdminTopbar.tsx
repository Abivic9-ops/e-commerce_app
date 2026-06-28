'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, LogOut, Shield, User, Store } from 'lucide-react';
import { toast } from 'sonner';

import { logoutAction } from '@/app/actions/auth';
import { AuthUser } from '@/lib/supabase/auth';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/ui/notification-bell';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { AdminSidebar } from './AdminSidebar';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface AdminTopbarProps {
  user: AuthUser;
}

export function AdminTopbar({ user }: AdminTopbarProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const result = await logoutAction();
        if (result.success) {
          toast.success('Logged out successfully.');
          
          // Full window redirect ensures Supabase session state cookie gets completely purged in client + server
          setTimeout(() => {
            window.location.href = '/';
          }, 500);
        } else {
          toast.error(result.error || 'Failed to logout.');
        }
      } catch (err) {
        toast.error('An error occurred during logout.');
        console.error(err);
      }
    });
  };

  return (
    <header className="h-16 border-b border-border bg-card/60 backdrop-blur-md sticky top-0 z-30 flex items-center justify-between px-4 md:px-6">
      
      {/* Mobile Menu Trigger & Sidebar Sheet */}
      <div className="flex items-center gap-4">
        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden cursor-pointer">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Open menu</span>
            </Button>
          </SheetTrigger>
          {/* Note: The sheet inherits the .admin-theme variables because it is rendered inside a portal, 
              so we add admin-theme explicitly to SheetContent to maintain matching dark visuals! */}
          <SheetContent side="left" className="p-0 w-[270px] border-r border-border admin-theme bg-card text-foreground">
            <AdminSidebar onLinkClick={() => setIsMobileMenuOpen(false)} />
          </SheetContent>
        </Sheet>

        {/* Brand visual on mobile / breadcrumbs on desktop */}
        <div className="flex items-center gap-2">
          <span className="md:hidden font-bold text-base bg-gradient-to-r from-primary to-indigo-400 bg-clip-text text-transparent">
            ShopEasy Admin
          </span>
          <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-muted-foreground font-medium bg-secondary/80 border border-border px-2.5 py-1 rounded-lg">
            <Shield className="h-3.5 w-3.5 text-primary" />
            Role: Administrative Console
          </span>
        </div>
      </div>

      {/* Action utilities */}
      <div className="flex items-center gap-3">

        {/* View customer site */}
        <Link href="/">
          <Button variant="outline" size="sm" className="gap-2 border-border cursor-pointer">
            <Store className="h-4 w-4" />
            <span className="hidden sm:inline text-xs">View Site</span>
          </Button>
        </Link>

        {/* Notification Bell */}
        <NotificationBell inAdmin />

        {/* User Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="gap-2 border-border cursor-pointer">
              <User className="h-4 w-4 text-primary" />
              <span className="max-w-[120px] truncate text-xs font-semibold hidden sm:inline">
                {user.email}
              </span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 admin-theme border-border bg-card text-foreground">
            <DropdownMenuLabel className="font-semibold text-xs text-muted-foreground">
              My Account
            </DropdownMenuLabel>
            <div className="px-2 py-1.5 text-sm font-medium text-foreground truncate select-none">
              {user.email}
            </div>
            <DropdownMenuSeparator className="bg-border" />
            <DropdownMenuItem 
              onClick={handleLogout} 
              disabled={isPending}
              className="text-destructive focus:bg-destructive/10 focus:text-destructive cursor-pointer font-medium"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>{isPending ? 'Logging out...' : 'Log out'}</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
