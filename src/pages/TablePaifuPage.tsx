import { useEffect, useMemo, useReducer, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

import { ApiError } from '@/api/http';
import { operationsApi, type TablePaifuDetail } from '@/api/operations';
import { Alert, AlertDescription, AlertTitle, Badge, Button, Card, CardContent, CardDescription, CardHeader, CardTitle, LoadingProgress, Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui';

function getOutcomeLabel(outcome: string) {
  switch (outcome) {
    case 'Tsumo':
      return '自摸';
    case 'Ron':
      return '荣和';
    case 'ExhaustiveDraw':
      return '流局';
    case 'AbortiveDraw':
      return '途中流局';
    default:
      return outcome;
  }
}

export function TablePaifuPage() {
  const { tableId = '' } = useParams();
  const [paifu, setPaifu] = useState<TablePaifuDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [reloadKey, forceReload] = useReducer((value) => value + 1, 0);

  useEffect(() => {
    let cancelled = false;

    async function loadPaifu() {
      try {
        setIsLoading(true);
        setError(null);
        const payload = await operationsApi.getTablePaifus(tableId);

        if (!cancelled) {
          setPaifu(payload.items[0] ?? null);
          if (!payload.items[0]) {
            setError('当前牌桌还没有可查看的牌谱。');
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          setPaifu(null);
          setError(
            loadError instanceof ApiError
              ? loadError.message
              : loadError instanceof Error
                ? loadError.message
                : '牌谱暂时无法加载。',
          );
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false);
        }
      }
    }

    if (tableId) {
      void loadPaifu();
    } else {
      setError('缺少牌桌编号。');
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [reloadKey, tableId]);

  const rounds = useMemo(() => paifu?.rounds ?? [], [paifu]);
  const standings = useMemo(() => paifu?.finalStandings ?? [], [paifu]);

  if (isLoading) {
    return (
      <section className="grid gap-6">
        <LoadingProgress label="正在加载牌谱" message="正在读取当前牌桌归档后的牌谱记录。" />
      </section>
    );
  }

  return (
    <section className="grid gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="grid gap-2">
          <div className="flex flex-wrap items-center gap-3">
            <Badge>牌谱查看</Badge>
            {paifu ? <Badge>已归档</Badge> : null}
          </div>
          <div>
            <h1 className="text-[clamp(2rem,3vw,2.5rem)] font-semibold text-[color:var(--text)]">牌桌牌谱</h1>
            <p className="text-[color:var(--muted-strong)]">牌桌编号 {tableId}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => forceReload()}>
            刷新牌谱
          </Button>
          <Link
            to="/tournament-ops"
            className="inline-flex min-h-[42px] items-center justify-center rounded-2xl border border-[color:var(--line)] bg-[rgba(255,255,255,0.03)] px-4 py-2.5 text-[color:var(--text)] no-underline transition-[transform,border-color] duration-200 hover:-translate-y-px"
          >
            返回赛事运营台
          </Link>
        </div>
      </div>

      {error ? (
        <Alert variant="warning">
          <AlertTitle>暂无牌谱</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {paifu ? (
        <>
          <Card>
            <CardHeader>
              <CardTitle>结算结果</CardTitle>
              <CardDescription>记录当前牌桌的最终名次与点数。</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>名次</TableHead>
                    <TableHead>玩家</TableHead>
                    <TableHead>方位</TableHead>
                    <TableHead>最终点数</TableHead>
                    <TableHead>Uma</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {standings.map((item) => (
                    <TableRow key={item.playerId}>
                      <TableCell>{item.placement}</TableCell>
                      <TableCell>{item.playerId}</TableCell>
                      <TableCell>{item.seat}</TableCell>
                      <TableCell>{item.finalPoints}</TableCell>
                      <TableCell>{item.uma ?? 0}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>局回顾</CardTitle>
              <CardDescription>先展示每局的结果摘要和动作数量，便于快速核对归档内容。</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-4">
              {rounds.map((round, index) => (
                <div
                  key={`${round.descriptor.roundWind}-${round.descriptor.handNumber}-${index}`}
                  className="rounded-[20px] border border-[color:var(--line)] bg-[rgba(7,18,28,0.72)] p-4"
                >
                  <div className="mb-2 flex flex-wrap items-center gap-3">
                    <strong>
                      {round.descriptor.roundWind} {round.descriptor.handNumber} 局
                    </strong>
                    <Badge>{getOutcomeLabel(round.result.outcome)}</Badge>
                    <span className="text-sm text-[color:var(--muted-strong)]">本场动作数 {round.actions.length}</span>
                  </div>
                  <div className="grid gap-1 text-sm text-[color:var(--muted-strong)]">
                    <span>和牌者：{round.result.winner ?? '无'}</span>
                    <span>放铳者：{round.result.target ?? '无'}</span>
                    <span>
                      番符：{round.result.han ?? '-'} 番 / {round.result.fu ?? '-'} 符
                    </span>
                    <span>点数：{round.result.points}</span>
                    <span>本局场棒：{round.descriptor.honba}</span>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </>
      ) : null}
    </section>
  );
}
