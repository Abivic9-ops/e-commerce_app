import { createClient } from '@/lib/supabase/server';
import HeaderClient from './HeaderClient';

export default async function Header() {
  let isAdmin = false;

  try {
    const supabase = await createClient();
    const { data } = await supabase.auth.getUser();
    isAdmin = data.user?.user_metadata?.role === 'admin';
  } catch {
    // Not authenticated – show the public-only nav
  }

  return <HeaderClient isAdmin={isAdmin} />;
}
