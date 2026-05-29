import {
  Button,
  Dialog,
  DialogBody,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogOverlay,
  DialogPortal,
  DialogSurface,
  DialogTitle,
  FieldGroup,
  SelectField,
  TextInputField,
} from '@/components/ui';
import type { TournamentFormat } from '@/objects/tournament';
import type { TournamentStageRuleDraft } from '../../objects/TournamentDetailRule.types';

export function TournamentRulesDialog({
  open,
  draft,
  isSubmitting,
  hasStage,
  onOpenChange,
  onDraftChange,
  onSubmit,
}: {
  open: boolean;
  draft: TournamentStageRuleDraft;
  isSubmitting: boolean;
  hasStage: boolean;
  onOpenChange: (open: boolean) => void;
  onDraftChange: (draft: TournamentStageRuleDraft) => void;
  onSubmit: () => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogPortal>
        <DialogOverlay />
        <DialogSurface className="text-[#f2f7fb] [&_option]:bg-[rgba(8,18,29,0.98)] [&_option]:text-[#f2f7fb] [&_[data-slot=dialog-title]]:text-[#f2f7fb] [&_[data-slot=input]]:text-[#f2f7fb] [&_[data-slot=select]]:text-[#f2f7fb]">
          <DialogHeader className="border-b border-[rgba(176,223,229,0.14)] px-6 py-5">
            <DialogTitle>
              {hasStage ? '修改当前阶段规则' : '创建当前阶段规则'}
            </DialogTitle>
            <DialogDescription>
              选择赛制并设置晋级人数。创建赛事时当前只开放瑞士轮和淘汰赛，这里保持同一套入口。
            </DialogDescription>
          </DialogHeader>

          <DialogBody className="px-6 py-5">
            <FieldGroup>
              <SelectField
                label="赛制"
                value={draft.format}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    format: event.currentTarget.value as TournamentFormat,
                  })
                }
                disabled={isSubmitting}
              >
                <option value="Swiss">瑞士轮</option>
                <option value="Knockout">淘汰赛</option>
              </SelectField>
              <TextInputField
                label={draft.format === 'Knockout' ? '入围人数' : '晋级人数'}
                type="number"
                min={1}
                step={1}
                value={draft.advanceCount}
                onChange={(event) =>
                  onDraftChange({
                    ...draft,
                    advanceCount: Number(event.currentTarget.value),
                  })
                }
                disabled={isSubmitting}
              />
            </FieldGroup>
          </DialogBody>

          <DialogFooter className="border-t border-[rgba(176,223,229,0.14)] px-6 py-5">
            <Button
              variant="secondary"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              取消
            </Button>
            <Button
              onClick={onSubmit}
              disabled={isSubmitting || draft.advanceCount < 1}
            >
              {isSubmitting ? '保存中...' : '保存规则'}
            </Button>
          </DialogFooter>
        </DialogSurface>
      </DialogPortal>
    </Dialog>
  );
}
