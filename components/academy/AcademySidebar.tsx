"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TENANT_ADMIN_NAV, tenantAdminHref } from "@/lib/tenant-admin-nav";

export default function AcademySidebar({ academyName }: { academyName: string }) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col border-r border-teal-800/30 bg-gradient-to-b from-slate-900 to-slate-800 lg:flex">
      <div className="border-b border-slate-700 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-400">학원 관리자</p>
        <p className="mt-1 truncate text-sm font-bold text-white">{academyName}</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {TENANT_ADMIN_NAV.map((item) => {
          const href = tenantAdminHref(item.href);
          const active =
            pathname === href ||
            (item.href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                active
                  ? "bg-teal-600/30 text-teal-100"
                  : "text-slate-400 hover:bg-slate-800 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-700 p-4 text-xs text-slate-500">
        회원사 전용 · 우리 학원 수강생만 조회
      </div>
    </aside>
  );
}

export function AcademyMobileNav() {
  const pathname = usePathname();
  return (
    <nav className="mb-4 flex flex-wrap gap-2 lg:hidden">
      {TENANT_ADMIN_NAV.map((item) => {
        const href = tenantAdminHref(item.href);
        const active = pathname === href || pathname.startsWith(`${href}/`);
        return (
          <Link
            key={item.href}
            href={href}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
              active ? "bg-teal-700 text-white" : "bg-white text-slate-700 shadow-sm"
            }`}
          >
            {item.icon} {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
