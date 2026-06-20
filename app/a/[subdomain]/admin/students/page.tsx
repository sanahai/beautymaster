import Link from "next/link";
import StudentTable from "@/components/academy/StudentTable";
import { requireSubsiteStaff, subsitePath } from "@/lib/academy-subsite";
import { getAcademyStudents } from "@/lib/academy-stats";

export const dynamic = "force-dynamic";

export default async function SubsiteAdminStudentsPage({
  params,
  searchParams,
}: {
  params: { subdomain: string };
  searchParams?: { q?: string; filter?: string };
}) {
  const { user, academy } = await requireSubsiteStaff(params.subdomain);
  const students = await getAcademyStudents(academy.id, {
    q: searchParams?.q,
    filter: searchParams?.filter,
    branchId: user.role === "branch_admin" ? user.branchId ?? undefined : undefined,
    teacherId: user.role === "teacher" ? user.id : undefined,
  });

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-white">수강생관리</h1>
        <p className="text-slate-400">총 {students.length}명</p>
      </div>
      <div className="flex flex-wrap gap-2">
        {["", "active", "warning"].map((f) => (
          <Link
            key={f || "all"}
            href={subsitePath(params.subdomain, `/admin/students${f ? `?filter=${f}` : ""}`)}
            className={`rounded-full px-4 py-1.5 text-sm font-semibold ${
              (searchParams?.filter || "") === f ? "bg-teal-700 text-white" : "border border-slate-600 text-slate-400"
            }`}
          >
            {f === "" ? "전체" : f === "active" ? "활성" : "주의"}
          </Link>
        ))}
      </div>
      <div className="overflow-hidden rounded-2xl border border-slate-700 bg-slate-800">
        <StudentTable students={students} />
      </div>
    </div>
  );
}
