import { Navigate } from 'react-router-dom';

import { AppealsPanel } from './components/AppealsPanel';
import { MissingApiNotes } from './components/MissingApiNotes';
import { RecordsPanel } from './components/RecordsPanel';
import { TableActionPanel } from './components/TableActionPanel';
import { TablesPanel } from './components/TablesPanel';
import { TournamentOpsEmptyState } from './components/TournamentOpsEmptyState';
import { TournamentOpsLoading } from './components/TournamentOpsLoading';
import { TournamentOpsPageFrame } from './components/TournamentOpsPageFrame';
import { TournamentOpsFiltersPanel } from './components/TournamentOpsFiltersPanel';
import { useTournamentOpsPage } from './hooks/useTournamentOpsPage';

export function TournamentOpsPage() {
  const page = useTournamentOpsPage();

  if (page.shouldRedirectToPublic) {
    return <Navigate replace to="/public" />;
  }

  if (page.isLoading) {
    return <TournamentOpsLoading />;
  }

  if (page.isEmpty) {
    return <TournamentOpsEmptyState />;
  }

  return (
    <TournamentOpsPageFrame>
      <TournamentOpsFiltersPanel
        tournaments={page.filters.tournaments}
        activeTournament={page.filters.activeTournament!}
        state={page.filters.state}
        hideTournamentSelect={page.filters.hideTournamentSelect}
        onReload={page.filters.onReload}
        onStateChange={page.filters.onStateChange}
      />

      <div className="grid gap-[18px] md:grid-cols-2">
        <TablesPanel
          payload={page.tables.payload}
          selectedTableId={page.tables.selectedTableId}
          onSelectTable={page.tables.onSelectTable}
          playerNames={page.tables.playerNames}
        />
        <TableActionPanel
          table={page.action.table}
          operatorId={page.action.operatorId}
          canManageActions={page.action.canManageActions}
          reloadKey={page.action.reloadKey}
          onRefresh={page.action.onRefresh}
          playerNames={page.action.playerNames}
        />
        <RecordsPanel payload={page.records} />
        <AppealsPanel payload={page.appeals} />
        <MissingApiNotes />
      </div>
    </TournamentOpsPageFrame>
  );
}
