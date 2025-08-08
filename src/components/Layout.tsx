import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { cleanupAuthState } from '@/lib/auth';
import { supabase } from '@/integrations/supabase/client';

export default function Layout({ children }: { children: React.ReactNode }) {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const isActive = (path: string) => pathname === path;
  
  const handleSignOut = async () => {
    cleanupAuthState();
    try { await supabase.auth.signOut({ scope: 'global' }); } catch (_) {}
    window.location.href = '/auth';
  };
  
  return (
    <div className="min-h-screen">
      <header className="border-b-4 border-foreground bg-background sticky top-0 z-10">
        <div className="container mx-auto flex items-center justify-between py-4">
          <Link to="/" className="no-underline">
            <h1 className="text-3xl font-black tracking-tight">Forms.io</h1>
          </Link>
          <nav className="flex gap-3">
            <Link to="/about">
              <Button variant="brutal" size="lg" aria-current={isActive('/about') ? 'page' : undefined}>About</Button>
            </Link>
            {user ? (
              <>
                <Link to="/dashboard">
                  <Button variant="brutal" size="lg" aria-current={isActive('/dashboard') ? 'page' : undefined}>Dashboard</Button>
                </Link>
                <Link to="/create">
                  <Button variant="brutal" size="lg" aria-current={isActive('/create') ? 'page' : undefined}>Create</Button>
                </Link>
                <Link to="/preview">
                  <Button variant="brutal" size="lg" aria-current={isActive('/preview') ? 'page' : undefined}>Preview</Button>
                </Link>
                <Link to="/myforms">
                  <Button variant="brutal" size="lg" aria-current={isActive('/myforms') ? 'page' : undefined}>My Forms</Button>
                </Link>
                <Button variant="destructive" size="lg" onClick={handleSignOut}>Sign out</Button>
              </>
            ) : (
              <Link to="/auth">
                <Button variant="brutal" size="lg" aria-current={isActive('/auth') ? 'page' : undefined}>Login</Button>
              </Link>
            )}
          </nav>
        </div>
      </header>
      <main className="container mx-auto py-8 px-4">
        {children}
      </main>
    </div>
  );
}
