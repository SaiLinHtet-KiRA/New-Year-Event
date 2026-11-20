"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/hr/draw", label: "Draw & winners" },
  { href: "/hr/participants", label: "Participants" },
  { href: "/hr/collection", label: "Prize collection" },
  { href: "/hr/report", label: "Management report" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <nav className="flex gap-1 overflow-x-auto">
      {links.map((link) => {
        const active = pathname === link.href;
        return (
          <Link
            key={link.href}
            href={link.href}
            className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium transition ${
              active
                ? "bg-rose-700 text-white"
                : "text-stone-300 hover:bg-white/10 hover:text-white"
            }`}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
