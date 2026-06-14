import { createClient } from './server';
import { redirect } from 'next/navigation';

export interface AuthUser {
  id: string;
  email?: string;
  role: 'admin' | 'buyer';
  metadata: any;
}

/**
 * Retrieves the current authenticated user session and returns clean user details.
 */
export async function getCurrentUser(): Promise<AuthUser | null> {
  try {
    const supabase = await createClient();
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();

    if (error || !user) {
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: (user.user_metadata?.role as 'admin' | 'buyer') || 'buyer',
      metadata: user.user_metadata,
    };
  } catch (error) {
    console.error('Error in getCurrentUser:', error);
    return null;
  }
}

/**
 * Server guard that forces user authentication and role verification.
 * Redirects appropriately if requirements are not met.
 */
export async function requireRole(allowedRole: 'admin' | 'buyer'): Promise<AuthUser> {
  const user = await getCurrentUser();

  if (!user) {
    redirect(`/login?redirectTo=${encodeURIComponent(allowedRole === 'admin' ? '/admin' : '/')}`);
  }

  if (user.role !== allowedRole) {
    if (allowedRole === 'admin') {
      // Regular buyers trying to access admin dashboard go to home
      redirect('/');
    } else {
      // Admin trying to access buyer checkout, they might be allowed, but if not:
      redirect('/login');
    }
  }

  return user;
}
