/** 배포·로컬 공통 사이트 기준 URL */
export function getSiteUrl(): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ||
    (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:3000")
  );
}

export function absoluteUrl(path: string): string {
  const base = getSiteUrl();
  return path.startsWith("/") ? `${base}${path}` : `${base}/${path}`;
}
