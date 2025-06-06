'use client';
import Link from 'next/link';

const navLinks = [
  { href: '/pages/countdown', label: 'Countdown' },
  { href: '/pages/input', label: 'Add Attempt' },
  { href: '/pages/log', label: 'Log' },
  { href: '/pages/recap', label: 'Recap' },
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