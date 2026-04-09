import { EmptyState } from '@/components/shared/feedback';
import { CheckboxField, FieldGroup, SelectField, TextareaField } from '@/components/shared/forms';
import {
  Alert,
  AlertDescription,
  AlertTitle,
  Button,
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui';
import type { SeatWind, TableDetail, TournamentTableSummary } from '@/domain/operations';

import { getTableStatusLabel } from './status';

interface TableActionPanelProps {
  table: TournamentTableSummary | null;
  tableDetail: TableDetail | null;
  operatorId?: string;
  canManageActions: boolean;
  isSubmitting: boolean;
  error?: string | null;
  resetNote: string;
  appealDescription: string;
  seatWind: SeatWind;
  seatReady: boolean;
  seatDisconnected: boolean;
  seatNote: string;
  onResetNoteChange: (value: string) => void;
  onAppealDescriptionChange: (value: string) => void;
  onSeatWindChange: (value: SeatWind) => void;
  onSeatReadyChange: (value: boolean) => void;
  onSeatDisconnectedChange: (value: boolean) => void;
  onSeatNoteChange: (value: string) => void;
  onStartTable: () => void;
  onResetTable: () => void;
  onFileAppeal: () => void;
  onUpdateSeatState: () => void;
  onOpenTablePage: () => void;
  onOpenPaifuPage: () => void;
  playerNames: Record<string, string>;
}

export function TableActionPanel({
  table,
  tableDetail,
  operatorId,
  canManageActions,
  isSubmitting,
  error,
  resetNote,
  appealDescription,
  seatWind,
  seatReady,
  seatDisconnected,
  seatNote,
  onResetNoteChange,
  onAppealDescriptionChange,
  onSeatWindChange,
  onSeatReadyChange,
  onSeatDisconnectedChange,
  onSeatNoteChange,
  onStartTable,
  onResetTable,
  onFileAppeal,
  onUpdateSeatState,
  onOpenTablePage,
  onOpenPaifuPage,
  playerNames,
}: TableActionPanelProps) {
  const canOperate = Boolean(table && operatorId && canManageActions);
  const playerLabel = table?.playerIds?.length
    ? table.playerIds.map((playerId) => playerNames[playerId] ?? playerId).join(', ')
    : 'Players unavailable';
  const selectedSeat = tableDetail?.seats.find((seat) => seat.seat === seatWind) ?? null;
  const isWaitingTable = table?.status === 'WaitingPreparation';
  const isArchivedTable = table?.status === 'Archived';
  const isStartedTable = Boolean(table && !isWaitingTable && !isArchivedTable);

  return (
    <Card className="tournament-ops__actions">
      <CardHeader>
        <CardTitle>Table Actions</CardTitle>
        <CardDescription>
          {isWaitingTable
            ? 'Start the table, reset it, file an appeal, or update seat readiness.'
            : isArchivedTable
              ? 'This table has already ended. Open the archived paifu to review the match result.'
              : 'This table is already in progress or post-game flow. Continue from the match page.'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {table ? (
          <div className="grid gap-1 text-[color:var(--muted-strong)]">
            <strong>{table.tableCode}</strong>
            <span>{table.id}</span>
            <span>
              {getTableStatusLabel(table.status)} / {table.seatCount} seats / {playerLabel}
            </span>
          </div>
        ) : (
          <EmptyState asListItem={false}>Choose a table from the queue to unlock actions.</EmptyState>
        )}

        {!operatorId && canManageActions ? (
          <Alert variant="warning">
            <AlertTitle>Operator id unavailable</AlertTitle>
            <AlertDescription>Log in with a registered account before using tournament operations.</AlertDescription>
          </Alert>
        ) : null}

        {!canManageActions ? (
          <Alert variant="warning">
            <AlertTitle>Read-only tournament view</AlertTitle>
            <AlertDescription>
              Registered players can review table assignments, enter active match pages, and open archived paifu here.
              Seat readiness, table start, and appeal handling remain available only to tournament administrators.
            </AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="danger">
            <AlertTitle>Action failed</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isWaitingTable ? (
          <>
            <FieldGroup>
              <SelectField
                label="Seat"
                value={seatWind}
                onChange={(event) => onSeatWindChange(event.currentTarget.value as SeatWind)}
                disabled={!canOperate || isSubmitting}
              >
                <option value="East">East</option>
                <option value="South">South</option>
                <option value="West">West</option>
                <option value="North">North</option>
              </SelectField>
              {selectedSeat ? (
                <div className="grid gap-1 text-[color:var(--muted-strong)]">
                  <strong>{selectedSeat.seat}</strong>
                  <span>Player: {selectedSeat.playerId}</span>
                  <span>
                    Ready: {selectedSeat.ready ? 'Yes' : 'No'} / Disconnected: {selectedSeat.disconnected ? 'Yes' : 'No'}
                  </span>
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckboxField
                  label="Ready"
                  checked={seatReady}
                  onChange={(event) => onSeatReadyChange(event.currentTarget.checked)}
                  disabled={!canOperate || isSubmitting}
                />
                <CheckboxField
                  label="Disconnected"
                  checked={seatDisconnected}
                  onChange={(event) => onSeatDisconnectedChange(event.currentTarget.checked)}
                  disabled={!canOperate || isSubmitting}
                />
              </div>
              <TextareaField
                label="Seat update note"
                value={seatNote}
                placeholder="Optional note for the seat state change."
                onChange={(event) => onSeatNoteChange(event.currentTarget.value)}
                rows={3}
                disabled={!canOperate || isSubmitting}
              />
              <Button variant="secondary" onClick={onUpdateSeatState} disabled={!canOperate || isSubmitting}>
                Update seat state
              </Button>
              <TextareaField
                label="Reset note"
                value={resetNote}
                placeholder="Why are you force resetting this table?"
                onChange={(event) => onResetNoteChange(event.currentTarget.value)}
                rows={3}
                disabled={!canOperate || isSubmitting}
              />
              <TextareaField
                label="Appeal description"
                value={appealDescription}
                placeholder="Describe the issue that should be reviewed."
                onChange={(event) => onAppealDescriptionChange(event.currentTarget.value)}
                rows={4}
                disabled={!canOperate || isSubmitting}
              />
            </FieldGroup>

            <div className="flex flex-wrap gap-3">
              <Button onClick={onStartTable} disabled={!canOperate || isSubmitting}>
                Start table
              </Button>
              <Button variant="danger" onClick={onResetTable} disabled={!canOperate || isSubmitting}>
                Force reset
              </Button>
              <Button variant="outline" onClick={onFileAppeal} disabled={!canOperate || isSubmitting}>
                File appeal
              </Button>
            </div>
          </>
        ) : null}

        {isStartedTable ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onOpenTablePage} disabled={!table}>
              Enter match page
            </Button>
          </div>
        ) : null}

        {isArchivedTable ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onOpenPaifuPage} disabled={!table}>
              View paifu
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
