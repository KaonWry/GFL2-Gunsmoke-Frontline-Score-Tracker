'use client';
import Link from 'next/link';

export default function Navbar() {
  return (
    <nav style={{
      padding: "1em",
      background: "#eee",
      marginBottom: "2em",
      display: "flex",
      gap: "1em"
    }}>
      <Link href="/input">Add Attempt</Link>
      <Link href="/log">Log</Link>
      <Link href="/recap">Recap</Link>
    </nav>
  );
}