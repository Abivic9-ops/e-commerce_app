'use client';

import React, { useState, useTransition } from 'react';
import Link from 'next/link';
import { useRouter, usePathname } from 'next/navigation';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ShoppingCart, User, Search, Menu, Heart, LogOut, Settings, ChevronDown } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'sonner';
import { useCartStore } from '@/lib/store/useCartStore';
import CartSheet from '@/components/storefront/CartSheet';
import { NotificationBell } from '@/components/ui/notification-bell';
import { logoutAction } from '@/app/actions/auth';
import { useWishlist } from '@/context/WishlistContext';
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

const categories = [
  'All Categories',
  'T-Shirts',
  'Bags',
  'Watches',
  'Electronics',
  'Phones',
  'Home & Kitchen',
  'Shoes',
  'Deals',
  'Trending',
  'Essentials',
];

export default function HeaderClient({ user, isAdmin }: HeaderClientProps) {
  const router = useRouter();
  const pathname = usePathname();

  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchCategory, setSearchCategory] = useState('All Categories');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const { count: wishlistCount } = useWishlist();

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
    <header className="sticky top-0 z-50 w-full" style={{ backgroundColor: '#0F1B2D' }}>
      <div className="mx-auto flex max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
        {/* Top Row */}
        <div className="flex h-16 items-center justify-between gap-4">

          {/* Mobile Menu Trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden text-white hover:bg-white/10"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle mobile menu"
            id="mobile-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </Button>

          {/* Brand Logo */}
          <Link href="/" className="flex items-center gap-1 shrink-0 focus:outline-none" id="brand-logo">
            <span className="text-xl font-extrabold tracking-tight text-white sm:text-2xl">
              Shop
            </span>
            <span className="text-xl font-extrabold tracking-tight text-white/70 sm:text-2xl">
              Easy
            </span>
          </Link>

          {/* Search Bar */}
          <div className="hidden sm:flex flex-1 max-w-lg relative items-center">
            <div className="flex w-full items-center rounded-full overflow-hidden bg-white">
              {/* Category Dropdown */}
              <div className="relative">
                <button
                  onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                  className="flex items-center gap-1.5 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 border-r border-gray-200 whitespace-nowrap min-w-[130px]"
                >
                  {searchCategory}
                  <ChevronDown className="h-4 w-4" />
                </button>
                <AnimatePresence>
                  {categoryDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 4 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 4 }}
                      className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50 py-1 max-h-60 overflow-y-auto"
                    >
                      {categories.map((cat) => (
                        <button
                          key={cat}
                          onClick={() => {
                            setSearchCategory(cat);
                            setCategoryDropdownOpen(false);
                          }}
                          className={`w-full text-left px-4 py-2 text-sm transition-colors ${
                            cat === searchCategory
                              ? 'bg-blue-50 text-blue-600 font-medium'
                              : 'text-gray-700 hover:bg-gray-50'
                          }`}
                        >
                          {cat}
                        </button>
                      ))}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              <input
                type="text"
                placeholder="Search products, categories..."
                className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                id="desktop-search"
                onFocus={() => setSearchFocused(true)}
                onBlur={() => setSearchFocused(false)}
              />
              <button
                className="flex items-center justify-center px-5 py-2 bg-royal text-white hover:bg-blue-700 transition-colors"
                aria-label="Search"
              >
                <Search className="h-4 w-4" />
              </button>
            </div>
            <AnimatePresence>
              {searchFocused && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute top-12 left-0 right-0 p-4 bg-white border border-gray-200 shadow-xl rounded-2xl z-50 text-xs text-gray-500"
                >
                  Press enter to search or type a product name.
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Actions Menu */}
          <div className="flex items-center gap-1 sm:gap-2">

            {/* Notifications */}
            <NotificationBell inHeader />

            {/* Favorites / Wishlist */}
            <Button
              variant="ghost"
              size="icon"
              className="hidden sm:inline-flex rounded-full text-white/70 hover:text-white hover:bg-white/10 relative"
              aria-label="Wishlist"
              id="wishlist-button"
            >
              <Heart className="h-5 w-5" />
              {wishlistCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 h-5 w-5 rounded-full bg-red-500 text-[10px] font-bold text-white flex items-center justify-center">
                  {wishlistCount}
                </span>
              )}
            </Button>

            {/* Account Menu */}
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
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
                  <DropdownMenuItem asChild className="cursor-pointer font-medium">
                    <Link href="/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
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
                  className="rounded-full text-white/70 hover:text-white hover:bg-white/10"
                  aria-label="Sign In"
                >
                  <User className="h-5 w-5" />
                </Button>
              </Link>
            )}

            {/* Cart Sheet Component */}
            <div id="cart-link" className="relative">
              <CartSheet inHeader />
            </div>
          </div>
        </div>

        {/* Bottom Row - Secondary Navigation */}
        <div className="hidden md:flex items-center justify-between pb-2">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="text-white/80 hover:text-white transition-colors font-medium">
              Home
            </Link>
            <Link href="/products" className="text-white/80 hover:text-white transition-colors font-medium">
              Shop
            </Link>
            <Link href="/categories" className="text-white/80 hover:text-white transition-colors font-medium">
              Categories
            </Link>
            <Link href="/#flash-sale" className="text-white/80 hover:text-white transition-colors font-medium">
              Flash Sale
            </Link>
            <Link href="/help" className="text-white/80 hover:text-white transition-colors font-medium">
              Help
            </Link>
            {isAdmin && (
              <Link href="/admin" className="text-blue-300 hover:text-white transition-colors font-semibold">
                Admin Panel
              </Link>
            )}
          </nav>
          <div className="flex items-center gap-2 bg-emerald-600/20 rounded-full px-3 py-1">
            <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">M-PESA</span>
            <span className="text-xs text-emerald-300">Integrated</span>
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
            style={{ backgroundColor: '#0F1B2D' }}
            className="md:hidden border-t border-white/10 overflow-hidden"
          >
            <div className="space-y-1 px-4 py-3">
              <Link
                href="/"
                className="block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Shop
              </Link>
              <Link
                href="/categories"
                className="block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/#flash-sale"
                className="block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Flash Sale
              </Link>
              <Link
                href="/help"
                className="block rounded-lg px-3 py-2 text-base font-semibold text-white/90 hover:bg-white/10"
                onClick={() => setMobileMenuOpen(false)}
              >
                Help
              </Link>
              {isAdmin && (
                <Link
                  href="/admin"
                  className="block rounded-lg px-3 py-2 text-base font-semibold text-blue-300 hover:bg-white/10"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  Admin Panel
                </Link>
              )}
              <div className="pt-2">
                <div className="flex items-center bg-white rounded-full overflow-hidden">
                  <input
                    type="text"
                    placeholder="Search products..."
                    className="flex-1 px-4 py-2 text-sm text-gray-900 placeholder-gray-400 focus:outline-none bg-transparent"
                    id="mobile-search"
                  />
                  <button
                    aria-label="Search"
                    className="flex items-center justify-center px-4 py-2 bg-royal text-white hover:bg-blue-700 transition-colors"
                  >
                    <Search className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center justify-center gap-2 bg-emerald-600/20 rounded-full px-3 py-1.5 mt-2 mx-auto w-fit">
                <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider">M-PESA</span>
                <span className="text-xs text-emerald-300">Integrated</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
