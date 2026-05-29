import { Alert, AlertDescription, AlertTitle, Button } from '@/components/ui';
import type { TournamentTableSummary } from '@/pages/objects/TournamentViews';

interface TableNavigationActionsProps {
  table: TournamentTableSummary | null;
  canManageActions: boolean;
  isStartedTable: boolean;
  isArchivedTable: boolean;
  onOpenTablePage: () => void;
  onOpenPaifuPage: () => void;
}

export function TableNavigationActions({
  table,
  canManageActions,
  isStartedTable,
  isArchivedTable,
  onOpenTablePage,
  onOpenPaifuPage,
}: TableNavigationActionsProps) {
  return (
    <>
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
            <Button
              variant="secondary"
              onClick={onOpenTablePage}
              disabled={!table}
            >
              进入牌桌
            </Button>
          </div>
        </>
      ) : null}

      {isArchivedTable ? (
        <div className="flex flex-wrap gap-3">
          <Button
            variant="secondary"
            onClick={onOpenPaifuPage}
            disabled={!table}
          >
            查看牌谱
          </Button>
        </div>
      ) : null}
    </>
  );
}
