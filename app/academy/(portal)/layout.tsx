import AcademyHeader from "@/components/academy/AcademyHeader";
import AcademySidebar, { AcademyMobileNav } from "@/components/academy/AcademySidebar";
import { requireAcademyStaff } from "@/lib/academy-access";

export const dynamic = "force-dynamic";

export default async function AcademyPortalLayout({ children }: { children: React.ReactNode }) {
  const { academy } = await requireAcademyStaff();

  return (
    <div className="min-h-screen bg-slate-100">
      <AcademyHeader academyName={academy.name} logoUrl={academy.logoUrl} />
      <div className="mx-auto flex max-w-7xl">
        <AcademySidebar academyName={academy.name} />
        <main className="flex-1 px-4 py-6 sm:px-6 lg:py-8">
          <AcademyMobileNav />
          {children}
        </main>
      </div>
    </div>
  );
}
