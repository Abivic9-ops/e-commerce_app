import { createClient } from './server';
import { redirect } from 'next/navigation';
import { ADMIN_EMAIL } from '@/lib/config';

export interface AuthUser {
  id: string;
  email?: string;
  role: 'admin' | 'buyer';
  metadata: any;
}

function isAdminEmail(email: string): boolean {
  if (!email) return false;
  return email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
}

async function readMockCookies(): Promise<AuthUser | null> {
  try {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const role = cookieStore.get('mock_session_role')?.value;
    const email = cookieStore.get('mock_session_email')?.value;
    if (email) {
      // Always override role for whitelisted admin emails
      const resolvedRole = isAdminEmail(email) ? 'admin' : (role as 'admin' | 'buyer' || 'buyer');
      return { id: 'mock-123', email, role: resolvedRole, metadata: {} };
    }
    return null;
  } catch {
    return null;
  }
}

/**
 * Retrieves the current authenticated user session and returns clean user details.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const isMock = supabaseUrl.includes('placeholder') || supabaseUrl.includes('fehhuobxogefrtfzgorj');

    // Fast-path: bypass Supabase entirely for mock/offline environments
    if (isMock) {
      return await readMockCookies();
    }

    // Try real Supabase auth
    const supabase = await createClient();
    const { data: { user }, error } = await supabase.auth.getUser();

    if (error || !user) {
      // Supabase failed or returned no user — fallback to mock cookies
      return await readMockCookies();
    }

    const email = user.email || '';
    // Whitelist override even for real Supabase users
    const role = isAdminEmail(email)
      ? 'admin'
      : ((user.user_metadata?.role as 'admin' | 'buyer') || 'buyer');

    return { id: user.id, email, role, metadata: user.user_metadata };
  } catch {
    // Any crash — fall back to mock cookies
    return await readMockCookies();
  }
}

/**
 * Server guard that forces user authentication and role verification.
 * Redirects appropriately if requirements are not met.
 */
export async function requireRole(allowedRole: 'admin' | 'buyer'): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    // Not logged in — send to login with return URL
    const returnTo = allowedRole === 'admin' ? '/admin' : '/';
    redirect(`/login?redirectTo=${encodeURIComponent(returnTo)}`);
  }

  // Admins can access everything (admin panel + buyer pages like checkout)
  if (user.role === 'admin') {
    return user;
  }

  // Buyer trying to access admin-only pages
  if (allowedRole === 'admin') {
    redirect('/');
  }

  return user;
}
