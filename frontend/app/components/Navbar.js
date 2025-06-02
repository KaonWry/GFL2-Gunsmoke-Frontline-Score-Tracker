'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="w-full bg-white shadow mb-8 fixed top-0 left-0 z-50">
      <div className="flex items-center gap-6 px-4 py-3">
        <Link
          href="/input"
          className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
        >
          Add Attempt
        </Link>
        <Link
          href="/log"
          className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
        >
          Log
        </Link>
        <Link
          href="/recap"
          className="text-gray-700 font-semibold hover:text-blue-600 transition-colors"
        >
          Recap
        </Link>
      </div>
    </nav>
  );
}