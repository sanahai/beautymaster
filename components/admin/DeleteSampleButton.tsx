"use client";

import { useState } from "react";
import { useFormStatus } from "react-dom";
import { deleteSampleQuestionsAction } from "@/app/actions/admin";

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="rounded-btn border border-beauty-danger px-4 py-2 text-sm font-semibold text-beauty-danger hover:bg-beauty-danger hover:text-white disabled:opacity-60"
    >
      {pending ? "삭제 중..." : "🗑️ 샘플 문제 전체 삭제"}
    </button>
  );
}

export default function DeleteSampleButton() {
  const [confirmed, setConfirmed] = useState(false);

  return (
    <form
      action={deleteSampleQuestionsAction}
      onSubmit={(e) => {
        if (!confirmed) {
          const ok = window.confirm(
            "자동 생성된 샘플 문제를 모두 삭제합니다.\n(업로드한 문제는 그대로 유지됩니다.)\n계속할까요?"
          );
          if (!ok) {
            e.preventDefault();
            return;
          }
          setConfirmed(true);
        }
      }}
    >
      <SubmitButton />
    </form>
  );
}
