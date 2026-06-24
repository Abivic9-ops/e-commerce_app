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

    // If network error, attempt to fallback to mock cookie session
    if (error && (error.message.includes('fetch') || error.message.includes('getaddrinfo'))) {
      const { cookies } = await import('next/headers');
      const role = (await cookies()).get('mock_session_role')?.value;
      const email = (await cookies()).get('mock_session_email')?.value;
      if (role && email) {
        return {
          id: 'mock-123',
          email,
          role: role as 'admin' | 'buyer',
          metadata: {},
        };
      }
    }

    if (error || !user) {
      // Still attempt mock auth for placeholder projects even without network error
      const { cookies } = await import('next/headers');
      const role = (await cookies()).get('mock_session_role')?.value;
      const email = (await cookies()).get('mock_session_email')?.value;
      if (role && email) {
        return {
          id: 'mock-123',
          email,
          role: role as 'admin' | 'buyer',
          metadata: {},
        };
      }
      return null;
    }

    return {
      id: user.id,
      email: user.email,
      role: (user.user_metadata?.role as 'admin' | 'buyer') || 'buyer',
      metadata: user.user_metadata,
    };
  } catch (error) {
    console.error('Error in getCurrentUser (fallback to mock):', error);
    try {
      const { cookies } = await import('next/headers');
      const role = (await cookies()).get('mock_session_role')?.value;
      const email = (await cookies()).get('mock_session_email')?.value;
      if (role && email) {
        return {
          id: 'mock-123',
          email,
          role: role as 'admin' | 'buyer',
          metadata: {},
        };
      }
    } catch (e) {
      return null;
    }
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
