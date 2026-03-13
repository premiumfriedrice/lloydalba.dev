"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Network, User } from "lucide-react";

const navLinks = [
  { href: "/", label: "Graph", icon: Network },
  { href: "/about", label: "About", icon: User },
];

export default function Nav() {
  const pathname = usePathname();

  return (
    <nav className="sticky top-0 z-50">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <div className="flex items-center h-12">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            const Icon = link.icon;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`relative overflow-hidden flex items-center gap-2 px-4 py-2 text-[11px] tracking-widest uppercase transition-colors backdrop-blur-sm bg-black/20 ${
                  isActive
                    ? "text-[#c4b5fd]"
                    : "text-neutral-400 hover:text-white"
                }`}
              >
                <Icon size={14} strokeWidth={1.5} />
                {link.label}
                {isActive && (
                  <motion.div
                    layoutId="tab-indicator"
                    className="absolute bottom-0 left-0 right-0 h-[2px]"
                    style={{
                      background: "linear-gradient(to right, #c4b5fd, #e06c75)",
                    }}
                    transition={{ type: "spring", stiffness: 400, damping: 30 }}
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
