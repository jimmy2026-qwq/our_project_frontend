import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { operationsApi } from '@/api/operations';
import { EmptyState } from '@/components/shared/feedback';
import { Alert, Button, Dialog, DialogBody, DialogFooter, DialogHeader, DialogOverlay, DialogPortal, DialogSurface, DialogTitle, StatusPill } from '@/components/ui';
import type { TableDetail, AppealSummary, SeatWind } from '@/domain/operations';
import type { TournamentPublicProfile } from '@/domain/public';
import { useAuth } from '@/hooks/useAuth';

import type { DetailState } from '../types';
import { PublicDetailNotFound } from './shared';
import {
  PublishBlockedDialog,
  TournamentInvitedClubsPanel,
  TournamentOverviewPanel,
} from './tournament-detail.panels';
import { getTableStatusLabel, getTableStatusTone, useTournamentDetailWorkbench } from './tournament-detail.hooks';
import type { TournamentDetailTableItem } from './tournament-detail.types';

type TournamentDetailTab = 'home' | 'tables' | 'manage' | 'appeals';

const SEAT_ORDER: SeatWind[] = ['East', 'South', 'West', 'North'];

export const PublicTournamentDetailSection = ({
  state,
  onScheduleSuccess,
}: {
  state: DetailState<TournamentPublicProfile>;
  onScheduleSuccess?: () => void;
}) => {
  const navigate = useNavigate();
  const { session } = useAuth();
  const {
    workbench,
    setSelectedClubId,
    setPublishBlockedOpen,
    setShowMoreInfo,
    handleInviteClub,
    handlePublishTournament,
    handleScheduleStage,
  } = useTournamentDetailWorkbench({
    state,
    session,
    navigate,
    onScheduleSuccess,
  });
  const [activeTab, setActiveTab] = useState<TournamentDetailTab>('home');
  const [appeals, setAppeals] = useState<AppealSummary[]>([]);
  const [appealsError, setAppealsError] = useState('');
  const [selectedManageTable, setSelectedManageTable] = useState<TournamentDetailTableItem | null>(null);
  const [tableDetail, setTableDetail] = useState<TableDetail | null>(null);
  const [tableDetailError, setTableDetailError] = useState('');
  const [isLoadingTableDetail, setIsLoadingTableDetail] = useState(false);
  const [isSubmittingTableAction, setIsSubmittingTableAction] = useState(false);
  const [seatDrafts, setSeatDrafts] = useState<Record<SeatWind, { ready: boolean; disconnected: boolean }>>({
    East: { ready: false, disconnected: false },
    South: { ready: false, disconnected: false },
    West: { ready: false, disconnected: false },
    North: { ready: false, disconnected: false },
  });

  useEffect(() => {
    if (!workbench?.canManageTournament) {
      setActiveTab('home');
    }
  }, [workbench?.canManageTournament]);

  useEffect(() => {
    if (!workbench?.canManageTournament || !workbench.profile.id) {
      setAppeals([]);
      setAppealsError('');
      return;
    }

    let cancelled = false;
    void operationsApi
      .getAppeals({ tournamentId: workbench.profile.id, limit: 50, offset: 0 })
      .then((envelope) => {
        if (!cancelled) {
          setAppeals(envelope.items);
          setAppealsError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setAppeals([]);
          setAppealsError(error instanceof Error ? error.message : 'Unable to load appeals.');
        }
      });

    return () => {
      cancelled = true;
    };
  }, [workbench?.canManageTournament, workbench?.profile.id]);

  useEffect(() => {
    if (!selectedManageTable) {
      setTableDetail(null);
      setTableDetailError('');
      return;
    }

    let cancelled = false;
    setIsLoadingTableDetail(true);
    void operationsApi
      .getTable(selectedManageTable.id)
      .then((detail) => {
        if (!cancelled) {
          setTableDetail(detail);
          setSeatDrafts(
            SEAT_ORDER.reduce(
              (acc, seatWind) => {
                const seat = detail.seats.find((item) => item.seat === seatWind);
                acc[seatWind] = {
                  ready: seat?.ready ?? false,
                  disconnected: seat?.disconnected ?? false,
                };
                return acc;
              },
              {} as Record<SeatWind, { ready: boolean; disconnected: boolean }>,
            ),
          );
          setTableDetailError('');
        }
      })
      .catch((error) => {
        if (!cancelled) {
          setTableDetail(null);
          setTableDetailError(error instanceof Error ? error.message : 'Unable to load table detail.');
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoadingTableDetail(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedManageTable]);

  const operatorId = session?.user.operatorId ?? session?.user.userId ?? '';
  const waitingTables = useMemo(
    () => (workbench?.visibleTables ?? []).filter((table) => table.status === 'WaitingPreparation'),
    [workbench?.visibleTables],
  );

  if (!state.item || !workbench) {
    return <PublicDetailNotFound title="Tournament not found" />;
  }

  const tabItems: Array<{ id: TournamentDetailTab; label: string }> = [
    { id: 'home', label: '赛事主页' },
    { id: 'tables', label: '对局信息' },
    ...(workbench.canManageTournament
      ? [
          { id: 'manage' as const, label: '对局管理' },
          { id: 'appeals' as const, label: '查看申诉' },
        ]
      : []),
  ];

  async function handleSaveSeatDrafts() {
    if (!selectedManageTable || !operatorId) {
      return;
    }

    try {
      setIsSubmittingTableAction(true);
      await Promise.all(
        SEAT_ORDER.map((seat) =>
          operationsApi.updateSeatState(selectedManageTable.id, {
            operatorId,
            seat,
            ready: seatDrafts[seat].ready,
            disconnected: seatDrafts[seat].disconnected,
          }),
        ),
      );
      onScheduleSuccess?.();
      const refreshed = await operationsApi.getTable(selectedManageTable.id);
      setTableDetail(refreshed);
    } catch (error) {
      setTableDetailError(error instanceof Error ? error.message : 'Unable to save seat state.');
    } finally {
      setIsSubmittingTableAction(false);
    }
  }

  async function handleStartManagedTable(tableId: string) {
    if (!operatorId) {
      return;
    }

    try {
      setIsSubmittingTableAction(true);
      await operationsApi.startTable(tableId, { operatorId });
      onScheduleSuccess?.();
      if (selectedManageTable?.id === tableId) {
        setSelectedManageTable(null);
      }
    } catch (error) {
      setTableDetailError(error instanceof Error ? error.message : 'Unable to start table.');
    } finally {
      setIsSubmittingTableAction(false);
    }
  }

  return (
    <>
      <section className="tournament-detail-shell">
        <header className="tournament-detail-shell__header">
          <Link className="tournament-detail-shell__back" to="/public">
            返回大厅
          </Link>
          <div className="tournament-detail-shell__title-card">赛事：{workbench.profile.name}</div>
          <div className="tournament-detail-shell__header-actions">
            {workbench.canScheduleStage ? (
              <Button onClick={() => void handleScheduleStage()} disabled={workbench.isSubmittingTournamentAction}>
                排程下一阶段
              </Button>
            ) : null}
            {workbench.canPublishTournament ? (
              <Button
                variant="secondary"
                onClick={() => void handlePublishTournament()}
                disabled={workbench.isSubmittingTournamentAction}
              >
                发布赛事
              </Button>
            ) : null}
          </div>
        </header>

        <div className="tournament-detail-shell__frame">
          <aside className="tournament-detail-shell__sidebar">
            {tabItems.map((tab) => (
              <button
                key={tab.id}
                type="button"
                className={`tournament-detail-shell__nav-item ${
                  activeTab === tab.id ? 'tournament-detail-shell__nav-item--active' : ''
                }`}
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.label}
              </button>
            ))}
          </aside>

          <div
            className={`tournament-detail-shell__content ${
              activeTab === 'home' ? 'tournament-detail-shell__content--with-aside' : ''
            }`}
          >
            {activeTab === 'home' ? (
              <>
                <div className="tournament-detail-shell__panel tournament-detail-shell__panel--main">
                  <TournamentOverviewPanel
                    profile={workbench.profile}
                    showMoreInfo={workbench.showMoreInfo}
                    onToggleShowMore={() => setShowMoreInfo((current) => !current)}
                  />
                </div>
                <div className="tournament-detail-shell__panel tournament-detail-shell__panel--aside">
                  <TournamentInvitedClubsPanel
                    invitedClubs={workbench.invitedClubs}
                    selectableClubs={workbench.selectableClubs}
                    selectedClubId={workbench.selectedClubId}
                    canManageTournament={workbench.canManageTournament}
                    isSubmittingTournamentAction={workbench.isSubmittingTournamentAction}
                    onSelectedClubIdChange={setSelectedClubId}
                    onInviteClub={() => void handleInviteClub()}
                  />
                </div>
              </>
            ) : null}

            {activeTab === 'tables' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <section className="tournament-detail-list">
                  <div className="tournament-detail-list__body tournament-detail-list__body--cards">
                    {workbench.visibleTables.length > 0 ? (
                      workbench.visibleTables.map((table) => {
                        const playerLabel = table.playerIds.map((playerId) => workbench.playerNames[playerId] ?? playerId).join(' / ');
                        const isFinished = table.status === 'Archived';

                        return (
                          <article key={table.id} className="tournament-detail-list__row">
                            <div className="tournament-detail-list__row-main">
                              <strong>{table.tableCode}</strong>
                              <span>{table.stageName}</span>
                              <span>{playerLabel}</span>
                            </div>
                            <div className="tournament-detail-list__row-side">
                              <StatusPill tone={getTableStatusTone(table.status)}>{getTableStatusLabel(table.status)}</StatusPill>
                              <Link
                                className="detail-link tournament-detail-list__action"
                                to={isFinished ? `/tables/${table.id}/paifu` : `/tables/${table.id}`}
                              >
                                {isFinished ? '查看牌谱' : '进入牌桌'}
                              </Link>
                            </div>
                          </article>
                        );
                      })
                    ) : (
                      <EmptyState asListItem={false}>当前没有可显示的对局桌次。</EmptyState>
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === 'manage' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <section className="tournament-detail-list">
                  <div className="tournament-detail-list__body tournament-detail-list__body--cards">
                    {waitingTables.length > 0 ? (
                      waitingTables.map((table) => (
                        <article key={table.id} className="tournament-detail-list__row">
                          <div className="tournament-detail-list__row-main">
                            <strong>{table.tableCode}</strong>
                            <span>{table.stageName}</span>
                            <span>
                              {table.playerIds.map((playerId) => workbench.playerNames[playerId] ?? playerId).join(' / ')}
                            </span>
                          </div>
                          <div className="tournament-detail-list__row-side">
                            <Button variant="outline" size="sm" onClick={() => setSelectedManageTable(table)}>
                              查看详情
                            </Button>
                            <Button size="sm" onClick={() => void handleStartManagedTable(table.id)} disabled={isSubmittingTableAction}>
                              开桌
                            </Button>
                          </div>
                        </article>
                      ))
                    ) : (
                      <EmptyState asListItem={false}>当前没有等待开桌的桌次。</EmptyState>
                    )}
                  </div>
                </section>
              </div>
            ) : null}

            {activeTab === 'appeals' ? (
              <div className="tournament-detail-shell__panel tournament-detail-shell__panel--full">
                <section className="tournament-detail-list">
                  <div className="tournament-detail-list__body tournament-detail-list__body--cards">
                    {appealsError ? <Alert variant="danger">{appealsError}</Alert> : null}
                    {appeals.length > 0 ? (
                      appeals.map((appeal) => (
                        <article key={appeal.id} className="tournament-detail-list__row">
                          <div className="tournament-detail-list__row-main">
                            <strong>{appeal.id}</strong>
                            <span>桌次：{appeal.tableId}</span>
                            <span>提交人：{appeal.createdBy}</span>
                          </div>
                          <div className="tournament-detail-list__row-side">
                            <StatusPill tone={appeal.status === 'Open' ? 'warning' : appeal.status === 'Resolved' ? 'success' : 'neutral'}>
                              {appeal.status}
                            </StatusPill>
                            <span>{appeal.verdict}</span>
                          </div>
                        </article>
                      ))
                    ) : (
                      <EmptyState asListItem={false}>当前没有申诉记录。</EmptyState>
                    )}
                  </div>
                </section>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <PublishBlockedDialog open={workbench.publishBlockedOpen} onOpenChange={setPublishBlockedOpen} />

      <Dialog open={!!selectedManageTable} onOpenChange={(open) => !open && setSelectedManageTable(null)}>
        <DialogPortal>
          <DialogOverlay />
          <DialogSurface>
            <DialogHeader className="border-b border-[color:var(--line)] px-6 py-5">
              <DialogTitle>{selectedManageTable ? `${selectedManageTable.tableCode} 准备情况` : '桌次详情'}</DialogTitle>
            </DialogHeader>
            <DialogBody className="grid gap-4 px-6 py-5">
              {isLoadingTableDetail ? <p className="m-0 text-[color:var(--muted)]">正在加载桌次详情...</p> : null}
              {tableDetailError ? <Alert variant="danger">{tableDetailError}</Alert> : null}
              {tableDetail?.seats.map((seat) => (
                <div key={seat.seat} className="tournament-detail-seat-row">
                  <div className="grid gap-1">
                    <strong>{seat.seat}</strong>
                    <span>{workbench.playerNames[seat.playerId] ?? seat.playerId}</span>
                  </div>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={seatDrafts[seat.seat]?.ready ?? false}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        setSeatDrafts((current) => ({
                          ...current,
                          [seat.seat]: {
                            ...current[seat.seat],
                            ready: checked,
                          },
                        }));
                      }}
                    />
                    <span>已准备</span>
                  </label>
                  <label className="inline-flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={seatDrafts[seat.seat]?.disconnected ?? false}
                      onChange={(event) => {
                        const checked = event.currentTarget.checked;
                        setSeatDrafts((current) => ({
                          ...current,
                          [seat.seat]: {
                            ...current[seat.seat],
                            disconnected: checked,
                          },
                        }));
                      }}
                    />
                    <span>已断线</span>
                  </label>
                </div>
              ))}
            </DialogBody>
            <DialogFooter className="border-t border-[color:var(--line)] px-6 py-5">
              <Button variant="secondary" onClick={() => setSelectedManageTable(null)}>
                关闭
              </Button>
              <Button onClick={() => void handleSaveSeatDrafts()} disabled={!selectedManageTable || isSubmittingTableAction}>
                保存座位状态
              </Button>
              <Button
                variant="outline"
                onClick={() => selectedManageTable && void handleStartManagedTable(selectedManageTable.id)}
                disabled={!selectedManageTable || isSubmittingTableAction}
              >
                开桌
              </Button>
            </DialogFooter>
          </DialogSurface>
        </DialogPortal>
      </Dialog>
    </>
  );
};
