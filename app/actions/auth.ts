'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { loginSchema, signupSchema, LoginInput, SignupInput } from '@/lib/schemas/auth';
import { ADMIN_EMAIL } from '@/lib/config';

type LoginResponse = { success: false; error: string } | { success: true; error?: never; role: string; user: { id: string; email?: string } };

export async function loginAction(values: LoginInput): Promise<LoginResponse> {
  const validation = loginSchema.safeParse(values);
  if (!validation.success) {
    return { success: false, error: 'Invalid input data. Please check your credentials.' };
  }

  const { email, password } = validation.data;

  async function setMockSession(role: string) {
    const { cookies } = await import('next/headers');
    const cookieStore = await cookies();
    const cookieOpts = { path: '/', sameSite: 'lax' as const, maxAge: 60 * 60 * 24 * 7, httpOnly: true };
    cookieStore.set('mock_session_role', role, cookieOpts);
    cookieStore.set('mock_session_email', email, cookieOpts);
  }

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const isMock = supabaseUrl.includes('placeholder') || process.env.AUTH_MOCK === 'true';

    if (isMock) {
      const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'buyer';
      try {
        await setMockSession(role);
        return { success: true, role, user: { id: 'mock-123', email } };
      } catch (err: any) {
        console.error('Mock login failed:', err.message);
        return { success: false, error: 'Authentication service unavailable. Please try again.' };
      }
    }

    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      if (error.message.includes('fetch') || error.message.includes('getaddrinfo') || process.env.NEXT_PUBLIC_SUPABASE_URL?.includes('placeholder')) {
        const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'buyer';
        try {
          await setMockSession(role);
          return { success: true, role, user: { id: 'mock-123', email } };
        } catch (err: any) {
          console.error('Mock login failed:', err.message);
          return { success: false, error: 'Authentication service unavailable. Please try again.' };
        }
      }
      return { success: false, error: error.message };
    }

    await supabase.auth.getUser();
    const userEmail = data.user?.email || '';
    const role = userEmail.toLowerCase() === ADMIN_EMAIL.toLowerCase()
      ? 'admin'
      : (data.user?.user_metadata?.role || 'buyer');
    return { success: true, role, user: { id: data.user?.id, email: userEmail } };
  } catch (err: any) {
    console.error('Login action error, falling back to mock:', err.message);
    const role = email.toLowerCase() === ADMIN_EMAIL.toLowerCase() ? 'admin' : 'buyer';
    try {
      await setMockSession(role);
      return { success: true, role, user: { id: 'mock-123', email } };
    } catch (err2: any) {
      console.error('Mock login failed:', err2.message);
      return { success: false, error: 'Authentication service unavailable. Please try again.' };
    }
  }
}

export async function signupAction(values: SignupInput) {
  // 1. Validate input data
  const validation = signupSchema.safeParse(values);
  if (!validation.success) {
    return {
      success: false,
      error: validation.error.issues[0]?.message || 'Invalid input data.',
    };
  }

  const { email, password, fullName, role } = validation.data;

  try {
    // Use admin client (service role) to create users with email auto-confirmed.
    // This bypasses Supabase's email rate limits and avoids the need for email confirmation.
    const adminClient = createAdminClient();
    const { data, error } = await adminClient.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        fullName,
        role,
      },
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
      role,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    };
  } catch (err: any) {
    console.error('Signup action error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during registration. Please try again.',
    };
  }
}

export async function logoutAction() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
    const isMock = supabaseUrl.includes('placeholder') || process.env.AUTH_MOCK === 'true';

    // Always clear mock cookies as well
    const { cookies } = await import('next/headers');
    (await cookies()).delete('mock_session_role');
    (await cookies()).delete('mock_session_email');

    if (isMock) {
      return { success: true };
    }

    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error && !error.message.includes('fetch') && !error.message.includes('getaddrinfo')) {
      return {
        success: false,
        error: error.message,
      };
    }

    return {
      success: true,
    };
  } catch (err: any) {
    console.error('Logout action error:', err);
    // Even if Supabase crashes completely, ensure mock session is cleared
    const { cookies } = await import('next/headers');
    (await cookies()).delete('mock_session_role');
    (await cookies()).delete('mock_session_email');
    return {
      success: true,
    };
  }
}
