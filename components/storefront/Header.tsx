import { getCurrentUser } from '@/lib/supabase/auth';
import HeaderClient from './HeaderClient';

export default async function Header() {
  const user = await getCurrentUser();

  return (
    <HeaderClient
      user={user ? { id: user.id, email: user.email } : null}
      isAdmin={user?.role === 'admin'}
    />
  );
}
