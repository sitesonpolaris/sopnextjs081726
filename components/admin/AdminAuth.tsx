'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Lock, Mail, Loader as Loader2, LogOut, ArrowRight } from 'lucide-react';

export function useAdminAuth() {
  const [loading, setLoading] = useState(true);
  const [authed, setAuthed] = useState(false);

  useEffect(() => {
    let mounted = true;

    const checkSession = async () => {
      const { data } = await supabase.auth.getSession();
      if (!mounted) return;
      setAuthed(!!data.session);
      setLoading(false);
    };

    checkSession();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      (async () => {
        if (!mounted) return;
        setAuthed(!!session);
        setLoading(false);
      })();
    });

    return () => {
      mounted = false;
      listener.subscription.unsubscribe();
    };
  }, []);

  return { loading, authed };
}

export function AdminLoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
    } catch (err) {
      console.error('Login error:', err);
      setError(err instanceof Error ? err.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f8f8f8] px-6 pt-32 pb-16">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl border border-zero/10 shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="mx-auto w-14 h-14 rounded-2xl bg-fahrenheit/10 flex items-center justify-center mb-4">
              <Lock className="w-7 h-7 text-fahrenheit" />
            </div>
            <h1 className="text-2xl font-bold text-zero">Admin Dashboard</h1>
            <p className="text-sm text-zero/60 mt-1">Sign in to manage your site</p>
          </div>

          {error && (
            <div className="mb-4 rounded-lg bg-destructive/10 border border-destructive/30 px-4 py-3 text-sm text-destructive">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zero mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zero/40" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-lg border border-zero/15 text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent"
                  placeholder="you@example.com"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-zero mb-2">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-zero/15 text-zero focus:outline-none focus:ring-2 focus:ring-fahrenheit focus:border-transparent"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-fahrenheit text-white rounded-lg font-semibold hover:bg-fahrenheit/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function AdminSignOutButton() {
  const [loading, setLoading] = useState(false);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await supabase.auth.signOut();
    } catch (err) {
      console.error('Sign out error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleSignOut}
      disabled={loading}
      className="flex items-center gap-1.5 px-3 py-2 text-sm font-medium text-zero/70 hover:text-fahrenheit rounded-lg transition-colors disabled:opacity-50"
    >
      <LogOut className="w-4 h-4" />
      Sign Out
    </button>
  );
}
