"use client";

export type OptionStatus = "idle" | "selected" | "correct" | "wrong" | "disabled";

const STYLES: Record<OptionStatus, string> = {
  idle: "bg-white border-gray-200 text-beauty-neutral hover:border-primary hover:bg-primary-pale/40",
  selected: "bg-primary-pale border-primary text-primary",
  correct: "bg-[#E8F5E9] border-beauty-success text-beauty-success",
  wrong: "bg-[#FFEBEE] border-beauty-danger text-beauty-danger",
  disabled: "bg-[#F5F5F5] border-gray-200 text-gray-400",
};

export default function OptionButton({
  text,
  number,
  status,
  onClick,
  disabled,
}: {
  text: string;
  number: number;
  status: OptionStatus;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`flex w-full items-center gap-3 rounded-card border-2 px-4 py-4 text-left text-base font-medium transition-all ${STYLES[status]} ${
        disabled ? "cursor-default" : "cursor-pointer active:scale-[0.99]"
      }`}
    >
      <span
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full border-2 text-sm font-bold ${
          status === "correct"
            ? "border-beauty-success"
            : status === "wrong"
            ? "border-beauty-danger"
            : status === "selected"
            ? "border-primary"
            : "border-gray-300"
        }`}
      >
        {number}
      </span>
      <span className="flex-1">{text}</span>
      {status === "correct" && <span className="text-xl">✓</span>}
      {status === "wrong" && <span className="text-xl">✗</span>}
    </button>
  );
}
