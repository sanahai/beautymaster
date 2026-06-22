import { SERVICES } from "@/lib/services";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-8 border-b border-slate-200 pb-8 sm:grid-cols-3">
          <div>
            <p className="mb-3 text-sm font-bold text-slate-900">서비스</p>
            <ul className="space-y-2 text-sm text-slate-600">
              {SERVICES.map((s) => (
                <li key={s.id}>
                  <a
                    href={s.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-indigo-600 hover:underline"
                  >
                    {s.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-slate-900">고객지원</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <a href="mailto:support@passwave.kr" className="hover:text-indigo-600 hover:underline">
                  support@passwave.kr
                </a>
              </li>
            </ul>
          </div>
          <div>
            <p className="mb-3 text-sm font-bold text-slate-900">약관</p>
            <ul className="space-y-2 text-sm text-slate-600">
              <li>
                <span className="text-slate-400">이용약관 (준비 중)</span>
              </li>
              <li>
                <span className="text-slate-400">개인정보처리방침 (준비 중)</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 text-xs leading-relaxed text-slate-500">
          <p className="font-semibold text-slate-700">패스웨이브 (PASSwave)</p>
          <p className="mt-2">
            대표: 이동길 &nbsp;|&nbsp; 사업자등록번호: 326-58-00636
          </p>
          <p className="mt-1">주소: 인천광역시 미추홀구 석정로140번길 29</p>
          <p className="mt-1">
            고객문의:{" "}
            <a href="mailto:support@passwave.kr" className="hover:underline">
              support@passwave.kr
            </a>{" "}
            &nbsp;|&nbsp; 운영시간: 평일 10:00 ~ 16:00 (주말·공휴일 휴무)
          </p>
          <p className="mt-6 text-slate-400">© 2026 PASSwave. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
