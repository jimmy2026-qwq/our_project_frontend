import type { TableDetail } from '@/pages/objects/TournamentViews';

import type { TableSeat, TableSeatMap } from '../../objects/TableMatch.types';
import { AppealDialog } from './AppealDialog';
import { SeatsOverviewCard } from './SeatsOverviewCard';
import { TableMatchHeader } from './TableMatchHeader';

interface TableMatchSectionProps {
  table: TableDetail;
  backLink: string;
  seatMap: TableSeatMap;
  ownSeat: TableSeat | null;
  isRefreshing: boolean;
  isRegisteredPlayer: boolean;
  operatorId: string;
  canUpdateOwnReady: boolean;
  canFileAppeal: boolean;
  isUpdatingOwnReady: boolean;
  isAppealDialogOpen: boolean;
  appealDescription: string;
  appealError: string | null;
  isSubmittingAppeal: boolean;
  onRefresh: () => void;
  onToggleOwnReady: () => void;
  onOpenAppeal: () => void;
  onAppealOpenChange: (open: boolean) => void;
  onAppealDescriptionChange: (description: string) => void;
  onSubmitAppeal: () => void;
}

export function TableMatchSection({
  table,
  backLink,
  seatMap,
  ownSeat,
  isRefreshing,
  isRegisteredPlayer,
  operatorId,
  canUpdateOwnReady,
  canFileAppeal,
  isUpdatingOwnReady,
  isAppealDialogOpen,
  appealDescription,
  appealError,
  isSubmittingAppeal,
  onRefresh,
  onToggleOwnReady,
  onOpenAppeal,
  onAppealOpenChange,
  onAppealDescriptionChange,
  onSubmitAppeal,
}: TableMatchSectionProps) {
  return (
    <section className="grid gap-6">
      <TableMatchHeader
        table={table}
        backLink={backLink}
        isRefreshing={isRefreshing}
        canUpdateOwnReady={canUpdateOwnReady}
        isUpdatingOwnReady={isUpdatingOwnReady}
        ownSeat={ownSeat}
        onRefresh={onRefresh}
        onToggleOwnReady={onToggleOwnReady}
      />

      <SeatsOverviewCard
        table={table}
        seatMap={seatMap}
        ownSeat={ownSeat}
        canFileAppeal={canFileAppeal}
        isRegisteredPlayer={isRegisteredPlayer}
        operatorId={operatorId}
        onOpenAppeal={onOpenAppeal}
      />

      <AppealDialog
        open={isAppealDialogOpen}
        onOpenChange={onAppealOpenChange}
        appealDescription={appealDescription}
        appealError={appealError}
        operatorId={operatorId}
        canFileAppeal={canFileAppeal}
        isSubmittingAppeal={isSubmittingAppeal}
        onDescriptionChange={onAppealDescriptionChange}
        onSubmit={onSubmitAppeal}
      />
    </section>
  );
}
