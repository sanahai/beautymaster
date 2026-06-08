import { prisma } from "@/lib/prisma";
import { bulkUploadAction } from "@/app/actions/admin";

export default async function UploadPage() {
  const courses = await prisma.course.findMany({ orderBy: { id: "asc" } });

  const sample = `위생관리\t다음 중 소독에 대한 설명으로 옳은 것은?\t보기1\t보기2\t보기3\t보기4\t2\t소독은 병원성 미생물을 제거하는 것입니다.\t1\tFALSE`;

  return (
    <div>
      <h1 className="mb-2 text-2xl font-bold text-beauty-neutral">문제 일괄 업로드</h1>
      <p className="mb-6 text-beauty-gray">
        엑셀에서 복사한 데이터를 붙여넣으세요. 각 행은 <b>탭(Tab)</b>으로 구분합니다.
      </p>

      <div className="card mb-6">
        <h2 className="mb-3 font-bold text-beauty-neutral">컬럼 순서 (탭 구분)</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-primary-pale/40 text-left">
              <tr>
                <th className="px-3 py-2">subject</th>
                <th className="px-3 py-2">content</th>
                <th className="px-3 py-2">option_1~4</th>
                <th className="px-3 py-2">answer</th>
                <th className="px-3 py-2">explanation</th>
                <th className="px-3 py-2">difficulty</th>
                <th className="px-3 py-2">is_free</th>
              </tr>
            </thead>
            <tbody>
              <tr className="text-beauty-gray">
                <td className="px-3 py-2">과목명</td>
                <td className="px-3 py-2">지문</td>
                <td className="px-3 py-2">보기 4개</td>
                <td className="px-3 py-2">1~4</td>
                <td className="px-3 py-2">해설(선택)</td>
                <td className="px-3 py-2">1/2/3</td>
                <td className="px-3 py-2">TRUE/FALSE</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <form action={bulkUploadAction} className="card space-y-4">
        <div>
          <label className="label">대상 과정</label>
          <select name="courseId" className="input" required>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="label">데이터 (탭 구분, 한 줄에 한 문제)</label>
          <textarea
            name="data"
            className="input font-mono text-xs"
            rows={10}
            placeholder={sample}
            required
          />
        </div>
        <button className="btn-primary">업로드</button>
      </form>
    </div>
  );
}
