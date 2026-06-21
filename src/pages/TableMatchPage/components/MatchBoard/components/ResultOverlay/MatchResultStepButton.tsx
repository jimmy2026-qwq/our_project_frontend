/** 结果覆盖层中推进下一步或关闭结果的按钮。 */
export function ResultStepButton({
  className = '',
  label,
  onClick,
}: {
  className?: string;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      className={`rounded-xl border border-[rgba(236,197,122,0.34)] bg-[rgba(236,197,122,0.12)] px-5 py-2 text-sm font-bold text-[#ffd98a] transition hover:border-[rgba(236,197,122,0.58)] hover:bg-[rgba(236,197,122,0.18)] focus:outline-none focus:ring-2 focus:ring-[#ffd98a] focus:ring-offset-2 focus:ring-offset-[rgba(0,0,0,0.84)] ${className}`}
      onClick={onClick}
    >
      {label}
    </button>
  );
}
