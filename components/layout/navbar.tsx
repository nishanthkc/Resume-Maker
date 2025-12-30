'use client';

import Link from 'next/link';
import NavLink from '@/components/nav-link';
import Button from '@/components/button';

export default function Navbar() {
  return (
    <nav className="sticky top-0 z-[1000] px-10 py-5 flex items-center justify-between backdrop-blur-[20px] bg-[rgba(3,3,3,0.6)] dark:bg-[rgba(3,3,3,0.6)] border-b border-white/5">
      {/* Left: Logo/Brand */}
      <div className="font-semibold text-2xl">
        <Link href="/" className="hover:opacity-80 transition-opacity">
          Resume Maker
        </Link>
      </div>

      {/* Center: Navigation Links */}
      <div className="flex items-center gap-8">
        <NavLink href="/about">About</NavLink>
        <NavLink href="/features">Features</NavLink>
        <NavLink href="/pricing">Pricing</NavLink>
      </div>

      {/* Right: Sign In Button */}
      <div>
        <Button href="/signin" variant="primary">
          Sign In
        </Button>
      </div>
    </nav>
  );
}

