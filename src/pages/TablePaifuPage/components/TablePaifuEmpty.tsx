interface TablePaifuEmptyProps {
  error: string | null;
}

export function TablePaifuEmpty({ error }: TablePaifuEmptyProps) {
  return (
    <div className="grid min-h-[60vh] place-items-center text-[#c7d6e2]">
      <div className="rounded-[20px] border border-[rgba(176,223,229,0.14)] bg-[rgba(7,18,28,0.72)] px-5 py-4">
        {error ?? 'No paifu data is available.'}
      </div>
    </div>
  );
}
