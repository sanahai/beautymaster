import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "PASSWAVE — AI 국가자격증 문제은행",
  description:
    "미용·조리·전문자격까지 — BEAUTYmaster, COOKmaster, PASSmaster로 국가자격증 합격을 준비하세요.",
  openGraph: {
    title: "PASSWAVE — AI 국가자격증 문제은행",
    description: "미용·조리·전문자격까지 — PASSWAVE 하나로 시작하세요",
    url: "https://passwave.kr",
    siteName: "PASSWAVE",
    locale: "ko_KR",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link
          rel="stylesheet"
          as="style"
          crossOrigin="anonymous"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard@v1.3.9/dist/web/static/pretendard.min.css"
        />
      </head>
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
