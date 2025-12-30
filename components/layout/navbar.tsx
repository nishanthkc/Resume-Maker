'use client';

import Link from 'next/link';
import NavLink from '@/components/nav-link';
import Button from '@/components/button';
import ThemeToggle from '@/components/theme-toggle';

export default function Navbar() {
  return (
    <nav className="navbar sticky top-0 z-[1000] px-10 py-5 flex items-center justify-between backdrop-blur-[20px] border-b shadow-[0_1px_10px_rgba(0,0,0,0.6)]">
      {/* Left: Logo/Brand */}
      <div className="font-semibold text-2xl">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          Resume Maker
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-8">
        <NavLink href="#about">About</NavLink>
        <NavLink href="#faq">FAQ</NavLink>
      </div>

      {/* Right: Theme Toggle and Sign In Button */}
      <div className="flex items-center gap-4">
        <ThemeToggle />
        <Button href="/signin" variant="primary">
          Sign In
        </Button>
      </div>
    </nav>
  );
}

