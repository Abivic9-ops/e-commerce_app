'use server';

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { loginSchema, signupSchema, LoginInput, SignupInput } from '@/lib/schemas/auth';

export async function loginAction(values: LoginInput) {
  // 1. Validate input data
  const validation = loginSchema.safeParse(values);
  if (!validation.success) {
    return {
      success: false,
      error: 'Invalid input data. Please check your credentials.',
    };
  }

  const { email, password } = validation.data;

  try {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return {
        success: false,
        error: error.message,
      };
    }

    // Force session to be persisted to cookies before the response is sent.
    // Without this, the async onAuthStateChange callback may fire after the
    // Server Action has already returned, leaving the client without auth cookies.
    await supabase.auth.getUser();

    const role = data.user?.user_metadata?.role || 'buyer';

    return {
      success: true,
      role,
      user: {
        id: data.user?.id,
        email: data.user?.email,
      },
    };
  } catch (err: any) {
    console.error('Login action error:', err);
    return {
      success: false,
      error: 'An unexpected error occurred during login. Please try again.',
    };
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
    const supabase = await createClient();
    const { error } = await supabase.auth.signOut();
    
    if (error) {
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
    return {
      success: false,
      error: 'An unexpected error occurred during logout.',
    };
  }
}
