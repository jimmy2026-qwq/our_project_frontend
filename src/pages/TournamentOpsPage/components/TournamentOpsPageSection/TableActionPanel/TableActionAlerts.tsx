import { Alert, AlertDescription, AlertTitle } from '@/components/ui';

interface TableActionAlertsProps {
  operatorId?: string;
  canManageActions: boolean;
  error?: string | null;
}

export function TableActionAlerts({
  operatorId,
  canManageActions,
  error,
}: TableActionAlertsProps) {
  return (
    <>
      {!operatorId && canManageActions ? (
        <Alert variant="warning">
          <AlertTitle>当前没有可用操作员身份</AlertTitle>
          <AlertDescription>
            请先使用已注册账号登录，再进行赛事管理操作。
          </AlertDescription>
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
    </>
  );
}
