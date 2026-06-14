'use server';

import { createClient } from '@/lib/supabase/server';
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
    const supabase = await createClient();
    
    // We register the user with full name and custom role metadata
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          fullName,
          role,
        },
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
