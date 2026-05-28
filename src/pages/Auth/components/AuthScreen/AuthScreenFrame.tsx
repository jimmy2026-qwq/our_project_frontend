import type { ReactNode } from 'react';

export function AuthScreenFrame({ children }: { children: ReactNode }) {
  return (
    <main className={'relative z-10 min-h-screen overflow-hidden bg-[#0b1620] px-6 py-10 [color-scheme:dark] [font-family:"JetBrains_Sans","Segoe_UI",sans-serif] text-[#f2f7fb] [&_button]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif] [&_input]:[font-family:"JetBrains_Sans","Segoe_UI",sans-serif]'}>
      <section className="mx-auto grid min-h-[calc(100vh-5rem)] max-w-6xl items-center gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        {children}
      </section>
    </main>
  );
}

