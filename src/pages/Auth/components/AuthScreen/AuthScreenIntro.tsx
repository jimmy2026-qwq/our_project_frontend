export function AuthScreenIntro({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description?: string;
}) {
  return (
    <div className="grid gap-5">
      <p className="inline-flex w-fit rounded-full border border-[rgba(236,197,122,0.22)] bg-[rgba(255,255,255,0.04)] px-4 py-2 text-sm text-[#ecc57a]">
        {eyebrow}
      </p>
      <div className="grid gap-4">
        <h1 className="max-w-xl text-4xl font-semibold leading-tight text-[#c7d0d8] sm:text-5xl">
          {title}
        </h1>
        {description ? (
          <p className="max-w-xl text-base leading-8 text-[#9ab0c1]">
            {description}
          </p>
        ) : null}
      </div>
    </div>
  );
}

