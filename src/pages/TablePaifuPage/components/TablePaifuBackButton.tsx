interface TablePaifuBackButtonProps {
  onBack: () => void;
}

export function TablePaifuBackButton({ onBack }: TablePaifuBackButtonProps) {
  return (
    <button
      type="button"
      aria-label="返回上一页"
      className="fixed left-4 top-4 z-50 grid h-10 w-10 place-items-center rounded-full border border-[rgba(176,223,229,0.22)] bg-[rgba(7,18,28,0.82)] text-xl leading-none text-[#d9f5f7] shadow-[0_14px_30px_rgba(0,0,0,0.28)] backdrop-blur transition hover:border-[rgba(176,223,229,0.45)] hover:bg-[rgba(12,31,45,0.92)] focus:outline-none focus:ring-2 focus:ring-[#7ddce8]"
      onClick={onBack}
      title="返回上一页"
    >
      ←
    </button>
  );
}
