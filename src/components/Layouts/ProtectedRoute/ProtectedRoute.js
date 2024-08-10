import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from '@/context/AuthContext';
import { Loading } from '../Loading';

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/join/signin');
    }
  }, [loading, user, router]);

  if (loading || !user) {
    return <Loading size={45} loading={0} />
  }

  return children;
}
