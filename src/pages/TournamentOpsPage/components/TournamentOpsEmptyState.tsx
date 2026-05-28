import { EmptyState, SectionIntro } from '@/components/ui';

const tournamentOpsSectionClassName =
  'grid gap-[22px] rounded-[32px] bg-[rgba(9,21,33,0.86)] px-[30px] py-7';

export function TournamentOpsEmptyState() {
  return (
    <section className={tournamentOpsSectionClassName}>
      <SectionIntro
        eyebrow="Tournament Ops"
        title="Tournament Operations"
        description="This workbench now depends entirely on live backend tournament data."
      />
      <EmptyState>
        No tournament operations workspace is available right now.
      </EmptyState>
    </section>
  );
}
