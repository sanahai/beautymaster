const STAFF_ROLES = new Set(["owner", "teacher", "branch_admin"]);

/** 오픈 리다이렉트 방지 — 동일 origin 상대 경로만 허용 */
export function sanitizeRedirect(path: string | undefined | null, fallback: string): string {
  if (!path || !path.startsWith("/") || path.startsWith("//")) return fallback;
  return path;
}

/** 로그인·세션 있을 때 이동할 경로 (학원 서브사이트 redirect 우선) */
export function resolvePostLoginRedirect(role: string, redirectTo?: string | null): string {
  const explicit = redirectTo ? sanitizeRedirect(redirectTo, "") : "";

  if (explicit.startsWith("/a/")) return explicit;
  if (explicit) return explicit;

  if (role === "admin") return "/admin";
  if (STAFF_ROLES.has(role)) return "/academy/dashboard";
  return "/dashboard";
}

export function isSubsitePath(path: string): boolean {
  return path.startsWith("/a/") && /^\/a\/[^/]+(\/.*)?$/.test(path);
}
