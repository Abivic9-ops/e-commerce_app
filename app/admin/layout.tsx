import React from 'react';
import { requireRole } from '@/lib/supabase/auth';
import { AdminSidebar } from '@/components/admin/AdminSidebar';
import { AdminTopbar } from '@/components/admin/AdminTopbar';

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Enforce server-side security. Redirects to /login if not an admin.
  const adminUser = await requireRole('admin');

  return (
    <div className="admin-theme min-h-screen bg-background text-foreground flex flex-col md:flex-row">
      {/* Sidebar - hidden on mobile, visible on desktop */}
      <AdminSidebar className="hidden md:flex md:w-64 flex-shrink-0" />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <AdminTopbar user={adminUser} />

        {/* Dashboard Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8 bg-background/50">
          {children}
        </main>
      </div>
    </div>
  );
}
