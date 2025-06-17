"use client";
import Link from "next/link";
import { FaGithub } from "react-icons/fa";

const navLinks = [
  { href: "/countdown", label: "Countdown" },
  { href: "/input", label: "Add Attempt" },
  { href: "/log", label: "Log" },
  { href: "/recap", label: "Recap" },
];

export default function Navbar() {
  return (
    <nav className="gfl-navbar">
      <div className="gfl-navbar-inner flex justify-between">
        <div className="flex gap-4">
          {navLinks.map(({ href, label }) => (
            <Link key={href} href={href} className="gfl-navbar-link">
              {label}
            </Link>
          ))}
        </div>
        <a
          href="https://github.com/KaonWry/GFL2-Gunsmoke-Frontline-Score-Tracker"
          target="_blank"
          rel="noopener noreferrer"
          className="gfl-navbar-link text-2xl"
        >
          <FaGithub />
        </a>
      </div>
    </nav>
  );
}
