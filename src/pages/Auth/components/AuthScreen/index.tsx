import { AuthScreenCard } from './AuthScreenCard';
import type { AuthScreenProps } from './AuthScreen.types';

export function AuthScreen({
  eyebrow,
  title,
  description,
  ...cardProps
}: AuthScreenProps) {
  return (
    <main className={'relative z-10 min-h-screen overflow-hidden bg-[#0b1620] px-6 py-10 [color-scheme:dark] [font-family:"JetBrains_Sans","Segoe_UI",sans-serif] text-[#f2f7fb] [&_button]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_input]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif]'}>
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
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

        <AuthScreenCard
          eyebrow={eyebrow}
          title={title}
          description={description}
          {...cardProps}
        />
      </section>
    </main>
  );
}
