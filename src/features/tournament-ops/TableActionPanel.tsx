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
    : '暂无玩家信息';
  const selectedSeat = tableDetail?.seats.find((seat) => seat.seat === seatWind) ?? null;
  const isWaitingTable = table?.status === 'WaitingPreparation';
  const isArchivedTable = table?.status === 'Archived';
  const isStartedTable = Boolean(table && !isWaitingTable && !isArchivedTable);

  return (
    <Card className="tournament-ops__actions">
      <CardHeader>
        <CardTitle>牌桌操作</CardTitle>
        <CardDescription>
          {isWaitingTable
            ? '可以在这里开桌、重置牌桌、发起申诉，或更新座位准备状态。'
            : isArchivedTable
              ? '这张牌桌已经结束，可以打开牌谱查看本桌结果。'
              : '这张牌桌已经开始或进入赛后流程，请前往牌桌页面继续查看。'}
        </CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {table ? (
          <div className="grid gap-1 text-[color:var(--muted-strong)]">
            <strong>{table.tableCode}</strong>
            <span>{table.id}</span>
            <span>
              {getTableStatusLabel(table.status)} / {table.seatCount} 个座位 / {playerLabel}
            </span>
          </div>
        ) : (
          <EmptyState asListItem={false}>请先从左侧牌桌列表中选择一张桌子。</EmptyState>
        )}

        {!operatorId && canManageActions ? (
          <Alert variant="warning">
            <AlertTitle>当前没有可用操作员身份</AlertTitle>
            <AlertDescription>请先使用已注册账号登录，再进行赛事管理操作。</AlertDescription>
          </Alert>
        ) : null}

        {!canManageActions ? (
          <Alert variant="warning">
            <AlertTitle>当前是只读视图</AlertTitle>
            <AlertDescription>
              普通注册用户可以在这里查看对局安排、进入进行中的牌桌，以及查看已结束对局的牌谱。座位准备、开桌和申诉处理仍仅对赛事管理员开放。
            </AlertDescription>
          </Alert>
        ) : null}

        {error ? (
          <Alert variant="danger">
            <AlertTitle>操作失败</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : null}

        {isWaitingTable ? (
          <>
            <FieldGroup>
              <SelectField
                label="座位"
                value={seatWind}
                onChange={(event) => onSeatWindChange(event.currentTarget.value as SeatWind)}
                disabled={!canOperate || isSubmitting}
              >
                <option value="East">东</option>
                <option value="South">南</option>
                <option value="West">西</option>
                <option value="North">北</option>
              </SelectField>
              {selectedSeat ? (
                <div className="grid gap-1 text-[color:var(--muted-strong)]">
                  <strong>{selectedSeat.seat}</strong>
                  <span>玩家：{selectedSeat.playerId}</span>
                  <span>
                    已准备：{selectedSeat.ready ? '是' : '否'} / 已断线：{selectedSeat.disconnected ? '是' : '否'}
                  </span>
                </div>
              ) : null}
              <div className="grid gap-3 sm:grid-cols-2">
                <CheckboxField
                  label="已准备"
                  checked={seatReady}
                  onChange={(event) => onSeatReadyChange(event.currentTarget.checked)}
                  disabled={!canOperate || isSubmitting}
                />
                <CheckboxField
                  label="已断线"
                  checked={seatDisconnected}
                  onChange={(event) => onSeatDisconnectedChange(event.currentTarget.checked)}
                  disabled={!canOperate || isSubmitting}
                />
              </div>
              <TextareaField
                label="座位状态备注"
                value={seatNote}
                placeholder="可选，填写这次座位状态更新的备注。"
                onChange={(event) => onSeatNoteChange(event.currentTarget.value)}
                rows={3}
                disabled={!canOperate || isSubmitting}
              />
              <Button variant="secondary" onClick={onUpdateSeatState} disabled={!canOperate || isSubmitting}>
                更新座位状态
              </Button>
              <TextareaField
                label="重置备注"
                value={resetNote}
                placeholder="请填写强制重置这张牌桌的原因。"
                onChange={(event) => onResetNoteChange(event.currentTarget.value)}
                rows={3}
                disabled={!canOperate || isSubmitting}
              />
              <TextareaField
                label="申诉说明"
                value={appealDescription}
                placeholder="请描述需要复核的问题。"
                onChange={(event) => onAppealDescriptionChange(event.currentTarget.value)}
                rows={4}
                disabled={!canOperate || isSubmitting}
              />
            </FieldGroup>

            <div className="flex flex-wrap gap-3">
              <Button onClick={onStartTable} disabled={!canOperate || isSubmitting}>
                开始牌桌
              </Button>
              <Button variant="danger" onClick={onResetTable} disabled={!canOperate || isSubmitting}>
                强制重置
              </Button>
              <Button variant="outline" onClick={onFileAppeal} disabled={!canOperate || isSubmitting}>
                发起申诉
              </Button>
            </div>
          </>
        ) : null}

        {isStartedTable ? (
          <>
            {canManageActions ? (
              <Alert variant="warning">
                <AlertTitle>当前牌桌已经开始</AlertTitle>
                <AlertDescription>
                  座位准备和开桌操作只适用于尚未开始的牌桌。请从左侧列表中选择一张等待开始的桌子继续操作。
                </AlertDescription>
              </Alert>
            ) : null}
            <div className="flex flex-wrap gap-3">
              <Button variant="secondary" onClick={onOpenTablePage} disabled={!table}>
                进入牌桌
              </Button>
            </div>
          </>
        ) : null}

        {isArchivedTable ? (
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary" onClick={onOpenPaifuPage} disabled={!table}>
              查看牌谱
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
