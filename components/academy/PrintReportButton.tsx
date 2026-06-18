"use client";

export default function PrintReportButton() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="b2b-btn-accent"
    >
      PDF로 저장 (인쇄)
    </button>
  );
}
