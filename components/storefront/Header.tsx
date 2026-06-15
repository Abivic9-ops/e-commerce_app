import { createClient } from '@/lib/supabase/server';
import HeaderClient from './HeaderClient';

export default async function Header() {
  let user: { id: string; email?: string } | null = null;
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    if (data.user) {
      user = { id: data.user.id, email: data.user.email };
      isAdmin = data.user.user_metadata?.role === 'admin';
    }
  } catch {
    // Not authenticated – show the public-only nav
  }

  return <HeaderClient user={user} isAdmin={isAdmin} />;
}
