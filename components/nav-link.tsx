import Link from 'next/link';

interface NavLinkProps {
  href: string;
  children: React.ReactNode;
  className?: string;
}

export default function NavLink({ href, children, className = '' }: NavLinkProps) {
  return (
    <Link
      href={href}
      className={`nav-link text-sm font-medium transition-colors ${className}`}
    >
      {children}
    </Link>
  );
}
