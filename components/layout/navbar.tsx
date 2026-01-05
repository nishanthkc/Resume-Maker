'use client';

import Link from 'next/link';
import NavLink from '@/components/nav-link';
import Button from '@/components/button';
import ThemeToggle from '@/components/theme-toggle';
import { useAuth } from '@/context/auth-context';

export default function Navbar() {
  const { user, loading, signIn, signOut } = useAuth();

  const handleSignIn = async () => {
    try {
      await signIn();
    } catch (error) {
      console.error('Failed to sign in:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error('Failed to sign out:', error);
    }
  };

  return (
    <nav className="navbar sticky top-0 z-[1000] px-10 py-5 flex items-center justify-between backdrop-blur-[20px] border-b">
      {/* Left: Logo/Brand */}
      <div className="font-semibold text-2xl">
        <Link href="/" className="text-foreground hover:opacity-80 transition-opacity">
          Resume Maker
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-8">
        <NavLink href="#about">About</NavLink>
        <NavLink href="#faq">FAQ</NavLink>
      </div>

      {/* Right: Theme Toggle and Auth Button */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {loading ? (
          <div className="px-6 py-2.5 text-sm text-foreground-muted">Loading...</div>
        ) : user ? (
          <div className="flex items-center gap-4">
            <span className="text-sm text-foreground-secondary">
              {user.email || user.user_metadata?.full_name || 'User'}
            </span>
            <Button onClick={handleSignOut} variant="outline">
              Sign Out
            </Button>
          </div>
        ) : (
          <Button onClick={handleSignIn} variant="primary">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  );
}

