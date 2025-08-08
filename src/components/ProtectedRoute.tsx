import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
  const { session, loading } = useAuth();
  if (loading) return <div className="brutal-card">Loading…</div>;
  if (!session) return <Navigate to="/auth" replace />;
  return <>{children}</>;
}
