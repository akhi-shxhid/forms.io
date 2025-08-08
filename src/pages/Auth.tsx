import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { cleanupAuthState } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';

export default function Auth() {
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const signInWithGoogle = async () => {
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch (_) {}
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: `${window.location.origin}/` },
      });
      if (error) throw error;
    } catch (err: any) {
      toast({ title: 'Google sign-in error', description: err.message || 'Something went wrong' });
    }
  };

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      cleanupAuthState();
      try { await supabase.auth.signOut({ scope: 'global' }); } catch (_) {}

      if (mode === 'signup') {
        const redirectUrl = `${window.location.origin}/`;
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: { emailRedirectTo: redirectUrl },
        });
        if (error) throw error;
        toast({ title: 'Check your email', description: 'Confirm your address to finish signup.' });
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
        if (data.user) window.location.href = '/dashboard';
      }
    } catch (err: any) {
      toast({ title: 'Auth error', description: err.message || 'Something went wrong' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog defaultOpen>
      <DialogContent className="sm:max-w-[480px] animate-enter">
        <DialogHeader>
          <DialogTitle className="text-3xl font-black">{mode === 'login' ? 'Sign in' : 'Create account'}</DialogTitle>
          <DialogDescription>Fast, free, and secure — powered by Supabase.</DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <Button variant="brutal" className="w-full" onClick={signInWithGoogle}>Continue with Google</Button>
          <div className="text-center text-sm text-muted-foreground">or use email</div>
          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="brutal-label">Email</label>
              <Input className="brutal-input" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div>
              <label className="brutal-label">Password</label>
              <Input className="brutal-input" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <Button variant="brutal" size="xl" disabled={loading} className="w-full">
              {loading ? 'Please wait…' : mode === 'login' ? 'Sign in' : 'Sign up'}
            </Button>
          </form>
          <div className="mt-2 text-sm">
            {mode === 'login' ? (
              <button className="underline" onClick={() => setMode('signup')}>Need an account? Sign up</button>
            ) : (
              <button className="underline" onClick={() => setMode('login')}>Have an account? Sign in</button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
