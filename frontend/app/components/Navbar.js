'use client';
import Link from 'next/link';

const navLinks = [
  { href: '/pages/countdown', label: 'Countdown' },
  { href: '/pages/input', label: 'Add Attempt' },
  { href: '/pages/log', label: 'Log' },
  { href: '/pages/recap', label: 'Recap' },
];

export default function Navbar() {
  const linkClass =
    'text-gray-700 font-semibold hover:text-blue-600 transition-colors';
  return (
    <nav className="w-full bg-white shadow mb-8 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-6 px-4 py-3">
        {navLinks.map(({ href, label }) => (
          <Link key={href} href={href} className={linkClass}>
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}