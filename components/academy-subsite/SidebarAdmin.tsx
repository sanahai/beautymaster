"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { TENANT_ADMIN_NAV, subsiteTenantAdminHref } from "@/lib/tenant-admin-nav";

type Props = {
  subdomain: string;
  academyName: string;
  studentCount: number;
};

export default function SidebarAdmin({ subdomain, academyName, studentCount }: Props) {
  const pathname = usePathname();

  return (
    <aside className="hidden w-56 shrink-0 flex-col bg-slate-950 text-white lg:flex">
      <div className="border-b border-slate-800 p-4">
        <p className="text-xs font-bold uppercase tracking-wide text-teal-400">학원 관리자</p>
        <p className="mt-1 truncate text-sm font-bold">{academyName}</p>
        <p className="text-xs text-slate-500">수강생 {studentCount}명</p>
      </div>
      <nav className="flex-1 space-y-0.5 p-3">
        {TENANT_ADMIN_NAV.map((item) => {
          const href = subsiteTenantAdminHref(subdomain, item.href);
          const active =
            pathname === href ||
            (item.href !== "/dashboard" && pathname.startsWith(href));
          return (
            <Link
              key={item.href}
              href={href}
              className={`flex items-center gap-2.5 rounded-lg px-3 py-2.5 text-sm font-semibold ${
                active ? "bg-teal-600/25 text-teal-100" : "text-slate-400 hover:bg-slate-900 hover:text-white"
              }`}
            >
              <span>{item.icon}</span>
              {item.label}
            </Link>
          );
        })}
      </nav>
      <div className="border-t border-slate-800 p-4 text-xs text-slate-500">
        회원사 전용 · 통합관리자 메뉴와 분리
      </div>
    </aside>
  );
}

export const ADMIN_MOBILE_NAV = TENANT_ADMIN_NAV;
