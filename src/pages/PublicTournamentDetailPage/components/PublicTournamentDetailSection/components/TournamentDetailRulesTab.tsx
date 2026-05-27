import { TournamentCurrentRulesPanel } from './TournamentDetailRulesPanel';
import { detailShellClassNames } from '../styles';
import type { TournamentDetailWorkbenchState } from '../../../objects/tournament-detail.types';

export function TournamentDetailRulesTab({
  workbench,
  onOpenRulesDialog,
}: {
  workbench: TournamentDetailWorkbenchState;
  onOpenRulesDialog: () => void;
}) {
  return (
    <div className={detailShellClassNames.panel}>
      <section className={detailShellClassNames.list}>
        <div className={detailShellClassNames.panelBody}>
          <TournamentCurrentRulesPanel
            workbench={workbench}
            onOpenRulesDialog={onOpenRulesDialog}
          />
        </div>
      </section>
    </div>
  );
}
