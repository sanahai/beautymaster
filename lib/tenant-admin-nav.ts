/** 회원사(학원) 관리자 전용 메뉴 — 통합관리자(/admin)와 분리 */

export type TenantAdminNavItem = {
  href: string;
  label: string;
  icon: string;
};

export const TENANT_ADMIN_NAV: TenantAdminNavItem[] = [
  { href: "/dashboard", label: "대시보드", icon: "📊" },
  { href: "/enrollments", label: "수강관리", icon: "💳" },
  { href: "/reports", label: "오류신고", icon: "🚩" },
  { href: "/students", label: "수강생관리", icon: "👥" },
  { href: "/stats", label: "통계", icon: "📈" },
];

/** B2B 포털 경로 (/academy/*) */
export function tenantAdminHref(path: string): string {
  return path === "/dashboard" ? "/academy/dashboard" : `/academy${path}`;
}

/** 학원 서브사이트 경로 (/a/[subdomain]/admin/*) */
export function subsiteTenantAdminHref(subdomain: string, path: string): string {
  const base = `/a/${subdomain}/admin`;
  return path === "/dashboard" ? base : `${base}${path}`;
}
