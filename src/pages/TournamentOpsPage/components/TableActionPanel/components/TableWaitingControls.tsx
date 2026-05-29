import {
  Button,
  CheckboxField,
  FieldGroup,
  SelectField,
  TextareaField,
} from '@/components/ui';
import type { SeatWind } from '@/objects/tournament';
import type { TableDetail } from '@/pages/objects/TournamentViews';

interface TableWaitingControlsProps {
  canOperate: boolean;
  isSubmitting: boolean;
  selectedSeat: TableDetail['seats'][number] | null;
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
}

export function TableWaitingControls({
  canOperate,
  isSubmitting,
  selectedSeat,
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
}: TableWaitingControlsProps) {
  return (
    <>
      <FieldGroup>
        <SelectField
          label="座位"
          value={seatWind}
          onChange={(event) =>
            onSeatWindChange(event.currentTarget.value as SeatWind)
          }
          disabled={!canOperate || isSubmitting}
        >
          <option value="East">东</option>
          <option value="South">南</option>
          <option value="West">西</option>
          <option value="North">北</option>
        </SelectField>
        {selectedSeat ? (
          <div className="grid gap-1 text-[#c7d6e2]">
            <strong>{selectedSeat.seat}</strong>
            <span>玩家：{selectedSeat.playerId}</span>
            <span>
              已准备：{selectedSeat.ready ? '是' : '否'} / 已断线：
              {selectedSeat.disconnected ? '是' : '否'}
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
            onChange={(event) =>
              onSeatDisconnectedChange(event.currentTarget.checked)
            }
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
        <Button
          variant="secondary"
          onClick={onUpdateSeatState}
          disabled={!canOperate || isSubmitting}
        >
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
          onChange={(event) =>
            onAppealDescriptionChange(event.currentTarget.value)
          }
          rows={4}
          disabled={!canOperate || isSubmitting}
        />
      </FieldGroup>

      <div className="flex flex-wrap gap-3">
        <Button onClick={onStartTable} disabled={!canOperate || isSubmitting}>
          开始牌桌
        </Button>
        <Button
          variant="danger"
          onClick={onResetTable}
          disabled={!canOperate || isSubmitting}
        >
          强制重置
        </Button>
        <Button
          variant="outline"
          onClick={onFileAppeal}
          disabled={!canOperate || isSubmitting}
        >
          发起申诉
        </Button>
      </div>
    </>
  );
}
