'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import {
  Bell,
  X,
  CheckCheck,
  ShoppingCart,
  Flame,
  Package,
  Megaphone,
  Trash2,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import {
  useNotificationStore,
  type AppNotification,
  type NotificationType,
} from '@/lib/store/useNotificationStore';

const iconMap: Record<NotificationType, typeof ShoppingCart> = {
  cart: ShoppingCart,
  flash_sale: Flame,
  order: Package,
  general: Megaphone,
};

const colorMap: Record<NotificationType, string> = {
  cart: 'bg-blue-500/10 text-blue-600 dark:text-blue-400',
  flash_sale: 'bg-orange-500/10 text-orange-600 dark:text-orange-400',
  order: 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400',
  general: 'bg-purple-500/10 text-purple-600 dark:text-purple-400',
};

function formatTimeAgo(timestamp: number): string {
  const diff = Date.now() - timestamp;
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 7) return `${days}d ago`;
  return new Date(timestamp).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}

function groupNotifications(
  notifications: AppNotification[]
): { label: string; items: AppNotification[] }[] {
  const now = Date.now();
  const todayStart = new Date(now).setHours(0, 0, 0, 0);
  const yesterdayStart = todayStart - 86400000;
  const weekStart = todayStart - 7 * 86400000;

  const groups: { label: string; items: AppNotification[] }[] = [];

  const today = notifications.filter((n) => n.timestamp >= todayStart);
  if (today.length) groups.push({ label: 'Today', items: today });

  const yesterday = notifications.filter(
    (n) => n.timestamp >= yesterdayStart && n.timestamp < todayStart
  );
  if (yesterday.length) groups.push({ label: 'Yesterday', items: yesterday });

  const thisWeek = notifications.filter(
    (n) => n.timestamp >= weekStart && n.timestamp < yesterdayStart
  );
  if (thisWeek.length) groups.push({ label: 'This Week', items: thisWeek });

  const older = notifications.filter((n) => n.timestamp < weekStart);
  if (older.length) groups.push({ label: 'Older', items: older });

  return groups;
}

interface NotificationBellProps {
  inAdmin?: boolean;
}

export function NotificationBell({ inAdmin }: NotificationBellProps) {
  const [open, setOpen] = useState(false);
  const [hydrated, setHydrated] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const { notifications, getUnreadCount, markAsRead, markAllAsRead, dismissNotification, clearAll } =
    useNotificationStore();
  const unreadCount = getUnreadCount();
  const groups = groupNotifications(notifications);
  const hasNotifications = notifications.length > 0;

  useEffect(() => {
    setHydrated(true);
    function handleClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className={cn(
          'relative flex items-center justify-center w-9 h-9 rounded-full transition-all',
          inAdmin
            ? 'text-muted-foreground hover:text-foreground hover:bg-secondary/50'
            : 'text-foreground/80 hover:text-foreground border border-transparent hover:border-border/50 hover:bg-secondary'
        )}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        <AnimatePresence>
          {hydrated && unreadCount > 0 && (
            <motion.span
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ type: 'spring', stiffness: 500, damping: 25 }}
              className={cn(
                'absolute -top-0.5 -right-0.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 rounded-full text-[10px] font-extrabold leading-none shadow-lg',
                inAdmin
                  ? 'bg-primary text-primary-foreground ring-2 ring-card'
                  : 'bg-primary text-primary-foreground ring-2 ring-background'
              )}
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </motion.span>
          )}
        </AnimatePresence>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            className={cn(
              'absolute right-0 mt-2 w-[360px] sm:w-[400px] max-h-[520px] flex flex-col rounded-2xl border shadow-2xl overflow-hidden z-50',
              inAdmin
                ? 'bg-card border-border admin-theme'
                : 'bg-card border-border shadow-foreground/5'
            )}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border shrink-0">
              <div className="flex items-center gap-2">
                <Bell className="h-4 w-4 text-primary" />
                <span className="text-sm font-extrabold text-foreground">Notifications</span>
                {unreadCount > 0 && (
                  <span className="text-[11px] font-bold text-muted-foreground bg-secondary px-2 py-0.5 rounded-full">
                    {unreadCount} new
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1">
                {hasNotifications && (
                  <button
                    onClick={markAllAsRead}
                    className="flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-primary px-2 py-1 rounded-lg hover:bg-secondary transition-colors cursor-pointer"
                  >
                    <CheckCheck className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Mark all read</span>
                  </button>
                )}
                <button
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-center w-7 h-7 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-colors cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto scroll-smooth">
              {!hasNotifications ? (
                <div className="flex flex-col items-center justify-center py-14 px-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-secondary flex items-center justify-center mb-4">
                    <Bell className="h-6 w-6 text-muted-foreground" />
                  </div>
                  <p className="text-sm font-bold text-foreground mb-1">No notifications yet</p>
                  <p className="text-xs text-muted-foreground max-w-[220px]">
                    We&apos;ll notify you about flash sales, orders, and cart updates.
                  </p>
                </div>
              ) : (
                <div className="py-2">
                  {groups.map((group) => (
                    <div key={group.label}>
                      <div className="px-5 py-2">
                        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
                          {group.label}
                        </span>
                      </div>
                      {group.items.map((notif) => (
                        <NotificationItem
                          key={notif.id}
                          notification={notif}
                          onMarkRead={markAsRead}
                          onDismiss={dismissNotification}
                        />
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {hasNotifications && (
              <div className="flex items-center justify-between px-5 py-3 border-t border-border shrink-0 bg-secondary/20">
                <button
                  onClick={clearAll}
                  className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-destructive transition-colors cursor-pointer"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Clear all
                </button>
                <span className="text-[10px] text-muted-foreground font-medium">
                  {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
                </span>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotificationItem({
  notification,
  onMarkRead,
  onDismiss,
}: {
  notification: AppNotification;
  onMarkRead: (id: string) => void;
  onDismiss: (id: string) => void;
}) {
  const Icon = iconMap[notification.type];

  const content = (
    <div
      className={cn(
        'relative flex items-start gap-3 px-5 py-3 transition-colors cursor-pointer group',
        !notification.read && 'bg-primary/[0.03]',
        'hover:bg-secondary/50'
      )}
      onClick={() => {
        if (!notification.read) onMarkRead(notification.id);
      }}
    >
      <div
        className={cn(
          'flex items-center justify-center w-9 h-9 rounded-xl shrink-0 mt-0.5',
          colorMap[notification.type]
        )}
      >
        <Icon className="h-4 w-4" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <h4
            className={cn(
              'text-sm leading-tight truncate',
              !notification.read ? 'font-extrabold text-foreground' : 'font-semibold text-foreground/80'
            )}
          >
            {notification.title}
          </h4>
          <div className="flex items-center gap-1 shrink-0">
            <span className="text-[10px] text-muted-foreground font-medium whitespace-nowrap">
              {formatTimeAgo(notification.timestamp)}
            </span>
            {!notification.read && (
              <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
            )}
          </div>
        </div>
        <p className="text-xs text-muted-foreground mt-0.5 line-clamp-2 leading-relaxed">
          {notification.message}
        </p>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          onDismiss(notification.id);
        }}
        className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 flex items-center justify-center w-6 h-6 text-muted-foreground hover:text-foreground hover:bg-secondary rounded-lg transition-all cursor-pointer"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );

  if (notification.actionUrl) {
    return <Link href={notification.actionUrl}>{content}</Link>;
  }

  return content;
}
