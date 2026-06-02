import { Badge, Button } from '@/components/ui';
import type { MahjongLegalAction } from '@/objects';

import { getActionLabel, getActionTone } from './matchBoardLabels';

interface MatchActionBarProps {
  actionError: string | null;
  actions: MahjongLegalAction[];
  isSubmitting: boolean;
  onSubmitAction: (action: MahjongLegalAction) => void;
}

export function MatchActionBar({
  actionError,
  actions,
  isSubmitting,
  onSubmitAction,
}: MatchActionBarProps) {
  const buttonActions = actions.filter(
    (action) => action.commandType !== 'Discard',
  );

  if (buttonActions.length === 0 && !actionError) {
    return null;
  }

  return (
    <div className="absolute bottom-[116px] left-1/2 z-[18] grid w-[min(92%,760px)] -translate-x-1/2 gap-2">
      {actionError ? (
        <div className="justify-self-center rounded-2xl border border-[rgba(236,122,122,0.28)] bg-[rgba(36,12,17,0.82)] px-4 py-2 text-sm font-semibold text-[#ffb0a8] shadow-[0_12px_30px_rgba(0,0,0,0.22)] backdrop-blur">
          {actionError}
        </div>
      ) : null}

      {buttonActions.length > 0 ? (
        <div className="flex flex-wrap justify-center gap-2 rounded-2xl border border-[rgba(176,223,229,0.18)] bg-[rgba(7,18,28,0.78)] p-3 shadow-[0_18px_44px_rgba(0,0,0,0.28)] backdrop-blur">
          {buttonActions.map((action, index) => (
            <Button
              key={`${action.commandType}-${action.tile ?? 'none'}-${index}`}
              disabled={isSubmitting}
              onClick={() => onSubmitAction(action)}
              size="sm"
              variant={getActionTone(action.commandType)}
            >
              {getActionLabel(action)}
            </Button>
          ))}
          {isSubmitting ? <Badge variant="warning">提交中</Badge> : null}
        </div>
      ) : null}
    </div>
  );
}
