export type ServiceColor = "rose" | "amber" | "indigo";

export type Service = {
  id: string;
  name: string;
  url: string;
  color: ServiceColor;
  certs: string;
  desc: string;
  icon: string;
  navLabel: string;
};

export const SERVICES: Service[] = [
  {
    id: "beauty",
    name: "BEAUTYmaster",
    url: "https://beautymaster.kr",
    color: "rose",
    certs: "미용사·이용사",
    desc: "미용(일반·피부·네일·메이크업)과 이용사 필기 대비",
    icon: "💇‍♀️",
    navLabel: "미용",
  },
  {
    id: "cook",
    name: "COOKmaster",
    url: "https://cookmaster.kr",
    color: "amber",
    certs: "조리기능사",
    desc: "한식·중식·양식·일식 조리기능사 필기 대비",
    icon: "👨‍🍳",
    navLabel: "조리",
  },
  {
    id: "pass",
    name: "PASSmaster",
    url: "https://passmaster.kr",
    color: "indigo",
    certs: "전문·일반 자격증",
    desc: "지게차운전, 전기 등 다양한 국가자격증 필기 대비",
    icon: "📋",
    navLabel: "전문자격",
  },
];

export const COLOR_STYLES: Record<
  ServiceColor,
  { ring: string; bg: string; text: string; btn: string; btnHover: string }
> = {
  rose: {
    ring: "ring-rose-200",
    bg: "bg-rose-50",
    text: "text-rose-600",
    btn: "bg-rose-600",
    btnHover: "hover:bg-rose-700",
  },
  amber: {
    ring: "ring-amber-200",
    bg: "bg-amber-50",
    text: "text-amber-600",
    btn: "bg-amber-500",
    btnHover: "hover:bg-amber-600",
  },
  indigo: {
    ring: "ring-indigo-200",
    bg: "bg-indigo-50",
    text: "text-indigo-600",
    btn: "bg-indigo-600",
    btnHover: "hover:bg-indigo-700",
  },
};
