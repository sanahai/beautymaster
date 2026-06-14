import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BEAUTYmaster · 미용사 자격증 필기 문제은행",
    short_name: "BEAUTYmaster",
    description:
      "미용사(일반·피부·네일·메이크업)·이용사 자격증 필기 대비 문제은행. 무료체험 100문제 + 3회차 반복학습 + 6회 모의고사 + 오답복습.",
    lang: "ko",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#FFFFFF",
    theme_color: "#D81B60",
    categories: ["education"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      {
        src: "/icons/icon-maskable-512.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
  };
}
