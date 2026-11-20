import Link from "next/link";
import type { ReactNode } from "react";
import { Nav } from "./nav";

export default function HrLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="no-print sticky top-0 z-10 bg-stone-900 text-white shadow-sm">
        <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-3 px-5 pt-3 sm:px-8">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-amber-300">
              HR administration
            </p>
            <Link
              href="/"
              className="mt-0.5 block text-lg font-semibold hover:text-amber-200"
            >
              New Year Prize Draw
            </Link>
          </div>
          <Link href="/" className="text-sm text-stone-400 hover:text-white">
            ← Back to home
          </Link>
        </div>
        <nav className="mx-auto w-full max-w-6xl px-5 pb-2 pt-3 sm:px-8">
          <Nav />
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-8 sm:px-8">{children}</main>
    </div>
  );
}
