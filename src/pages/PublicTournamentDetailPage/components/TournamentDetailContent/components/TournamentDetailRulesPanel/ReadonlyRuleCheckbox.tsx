/** 规则面板中只读布尔规则的勾选展示项。 */
export function ReadonlyRuleCheckbox({
  label,
  checked,
}: {
  label: string;
  checked: boolean;
}) {
  return (
    <div className="inline-flex min-h-9 items-center justify-start gap-2">
      <span
        aria-hidden="true"
        className={[
          'grid size-5 place-items-center border text-[0.9rem] font-black leading-none',
          checked
            ? 'border-[rgba(87,227,141,0.72)] bg-[rgba(87,227,141,0.24)] text-[#57e38d] shadow-[0_0_16px_rgba(87,227,141,0.18)]'
            : 'border-[rgba(154,176,193,0.32)] bg-[rgba(255,255,255,0.035)] text-transparent',
        ].join(' ')}
      >
        ✓
      </span>
      <span className="text-[#f2f7fb]">{label}</span>
    </div>
  );
}
