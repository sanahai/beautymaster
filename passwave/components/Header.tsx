"use client";

import { useState } from "react";
import { SERVICES } from "@/lib/services";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-white/10 bg-[#1a1a40]/80 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 lg:px-6">
        <a href="#" className="text-xl font-extrabold tracking-tight text-white">
          PASS<span className="text-indigo-300">WAVE</span>
        </a>

        <nav className="hidden items-center gap-6 md:flex">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm font-semibold text-slate-200 transition-colors hover:text-white"
            >
              {s.navLabel}
            </a>
          ))}
        </nav>

        <button
          type="button"
          className="rounded-lg p-2 text-white md:hidden"
          aria-label="메뉴"
          onClick={() => setOpen((v) => !v)}
        >
          <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {open ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {open && (
        <nav className="border-t border-white/10 bg-[#1a1a40]/95 px-4 py-3 md:hidden">
          {SERVICES.map((s) => (
            <a
              key={s.id}
              href={s.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block py-2.5 text-sm font-semibold text-slate-200"
              onClick={() => setOpen(false)}
            >
              {s.name} · {s.navLabel}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}
