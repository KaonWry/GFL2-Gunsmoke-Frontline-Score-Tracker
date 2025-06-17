'use client';
import Link from 'next/link';

const navLinks = [
  { href: '/countdown', label: 'Countdown' },
  { href: '/input', label: 'Add Attempt' },
  { href: '/log', label: 'Log' },
  { href: '/recap', label: 'Recap' },
];

export default function Navbar() {
  return (
    <nav className="gfl-navbar">
      <div className="gfl-navbar-inner">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className="gfl-navbar-link">
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}