import { Link } from 'react-router-dom';

import { Alert, AlertDescription, AlertTitle, Button } from '@/components/ui';

import { matchBackLinkClassName } from '../functions/TableMatch.labels';

interface TableMatchErrorProps {
  error: string | null;
  backLink: string;
  onRetry: () => void;
}

/** 实时牌桌页加载失败或缺少桌面状态时的错误提示。 */
export function TableMatchError({
  error,
  backLink,
  onRetry,
}: TableMatchErrorProps) {
  return (
    <section className="grid gap-6">
      <Alert variant="danger">
        <AlertTitle>无法加载牌桌</AlertTitle>
        <AlertDescription>{error ?? '当前牌桌数据不可用。'}</AlertDescription>
      </Alert>
      <div className="flex flex-wrap gap-3">
        <Button onClick={onRetry}>重试</Button>
        <Link to={backLink} className={matchBackLinkClassName()}>
          返回赛事
        </Link>
      </div>
    </section>
  );
}
