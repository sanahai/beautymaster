import Link from "next/link";
import StudentTable from "@/components/academy/StudentTable";
import { requireAcademyStaff } from "@/lib/academy-access";
import { getAcademyStudents } from "@/lib/academy-stats";

export const dynamic = "force-dynamic";

export default async function AcademyStudentsPage({
  searchParams,
}: {
  searchParams?: { q?: string; filter?: string };
}) {
  const { user, academy } = await requireAcademyStaff();
  const students = await getAcademyStudents(academy.id, {
    q: searchParams?.q,
    filter: searchParams?.filter,
    branchId: user.role === "branch_admin" ? user.branchId ?? undefined : undefined,
    teacherId: user.role === "teacher" ? user.id : undefined,
  });

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-slate-900">수강생관리</h1>
      <p className="mb-6 text-sm text-slate-500">총 {students.length}명 · {academy.name}</p>

      <div className="mb-4 flex flex-wrap gap-2">
        {[
          { href: "/academy/students", label: "전체", filter: "" },
          { href: "/academy/students?filter=active", label: "활성", filter: "active" },
          { href: "/academy/students?filter=warning", label: "주의", filter: "warning" },
        ].map((tab) => (
          <Link
            key={tab.label}
            href={tab.href}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              (searchParams?.filter || "") === tab.filter
                ? "bg-teal-700 text-white"
                : "border border-slate-200 bg-white text-slate-700"
            }`}
          >
            {tab.label}
          </Link>
        ))}
      </div>

      <form className="mb-4">
        <input
          name="q"
          defaultValue={searchParams?.q}
          placeholder="이름 검색"
          className="rounded-lg border border-slate-200 px-3 py-2 text-sm"
        />
      </form>

      <StudentTable students={students} />
    </div>
  );
}
