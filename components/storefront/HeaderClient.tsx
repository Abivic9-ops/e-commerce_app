'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useTheme } from '@/components/ThemeProvider';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Sun, Moon, Search, Menu, Heart, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import CartSheet from '@/components/storefront/CartSheet';
import { logoutAction } from '@/app/actions/auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface HeaderClientProps {
  user: { id: string; email?: string } | null;
  isAdmin?: boolean;
}

export default function HeaderClient({ user, isAdmin }: HeaderClientProps) {
  const router = useRouter();
  const { theme, toggleTheme } = useTheme();
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      try {
        const result = await logoutAction();
        if (result.success) {
          toast.success('Logged out successfully.');
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
    <header className="sticky top-0 z-40 w-full border-b border-border bg-background/80 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex max-w-7xl h-16 items-center justify-between px-4 sm:px-6 lg:px-8 gap-4">

        {/* Mobile Menu Trigger */}
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle mobile menu"
          id="mobile-menu-toggle"
        >
          <Menu className="h-5 w-5" />
        </Button>

        {/* Brand Logo */}
        <Link href="/" className="flex items-center gap-1.5 focus:outline-none" id="brand-logo">
          <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent sm:text-2xl">
            Shop
          </span>
          <span className="text-xl font-extrabold tracking-tight sm:text-2xl">
            Easy
          </span>
        </Link>

        {/* Global Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-muted-foreground transition-colors">
          <Link href="/" className="hover:text-foreground transition-colors text-foreground">
            Home
          </Link>
          <Link href="/products" className="hover:text-foreground transition-colors">
            Shop
          </Link>
          <Link href="/categories" className="hover:text-foreground transition-colors">
            Categories
          </Link>
          <Link href="/#flash-sale" className="hover:text-foreground transition-colors">
            Flash Sale
          </Link>
          {isAdmin && (
            <Link href="/admin" className="text-primary font-semibold hover:text-primary/80 transition-colors">
              Admin Panel
            </Link>
          )}
        </nav>

        {/* Search Bar */}
        <div className="hidden sm:flex flex-1 max-w-md relative items-center">
          <div className="absolute left-3 pointer-events-none text-muted-foreground">
            <Search className="h-4 w-4" />
          </div>
          <Input
            type="search"
            placeholder="Search products, categories..."
            className="pl-9 bg-secondary/50 border-transparent focus:border-border rounded-full"
            id="desktop-search"
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
          />
          <AnimatePresence>
            {searchFocused && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                className="absolute top-12 left-0 right-0 p-4 bg-card border border-border shadow-xl rounded-2xl z-50 text-xs text-muted-foreground"
              >
                Press enter to search or type a product name.
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Actions Menu */}
        <div className="flex items-center gap-2">

          {/* Light/Dark Toggle */}
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="rounded-full text-foreground/80 hover:text-foreground"
            aria-label="Toggle Theme"
            id="theme-toggle"
          >
            {theme === 'dark' ? <Sun className="h-5 w-5 text-amber-400" /> : <Moon className="h-5 w-5" />}
          </Button>

          {/* Favorites (Storefront visual link) */}
          <Button
            variant="ghost"
            size="icon"
            className="hidden sm:inline-flex rounded-full text-foreground/80 hover:text-foreground"
            aria-label="Wishlist"
            id="wishlist-button"
          >
            <Heart className="h-5 w-5" />
          </Button>

          {/* Account Menu - dropdown when logged in, link to login when not */}
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="rounded-full text-foreground/80 hover:text-foreground"
                  aria-label="Account"
                  id="account-link"
                >
                  <User className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56 border-border bg-card text-foreground">
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
          ) : (
            <Link href="/login" id="account-link">
              <Button
                variant="ghost"
                size="icon"
                className="rounded-full text-foreground/80 hover:text-foreground"
                aria-label="Sign In"
              >
                <User className="h-5 w-5" />
              </Button>
            </Link>
          )}

          {/* Cart Sheet Component */}
          <div id="cart-link" className="relative">
            <CartSheet />
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-t border-border bg-background transition-colors duration-200 overflow-hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <Link
                href="/"
                className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-secondary text-foreground"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/categories"
                className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/#flash-sale"
                className="block rounded-lg px-3 py-2 text-base font-semibold hover:bg-secondary"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flash Sale
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-primary hover:bg-secondary"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-2">
                <Input
                  type="search"
                  placeholder="Search products..."
                  className="w-full bg-secondary/50 border-transparent rounded-full"
                  id="mobile-search"
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
