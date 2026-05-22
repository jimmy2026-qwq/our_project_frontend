import { useEffect, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';

import { LoadingProgress } from '@/components/ui';
import { ApiError } from '@/system/api/http';

import { PaifuHandTable } from './components/PaifuHandTable';
import { loadTablePaifus } from './data';
// Temporary demo fallback. Delete this import and the fallback branches below
// when the backend can seed or generate real paifu records for this page.
import { createDemoTablePaifu } from './demo';
import { getInitialRoundIndex } from './objects/replay';
import type { TablePaifuDetail } from './types';

export function TablePaifuPage() {
  const { tableId = '' } = useParams();
  const [paifu, setPaifu] = useState<TablePaifuDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoundIndex, setSelectedRoundIndex] = useState(0);

  useEffect(() => {
    let cancelled = false;

    async function loadPaifu() {
      try {
        setIsLoading(true);
        setError(null);
        const payload = await loadTablePaifus(tableId);

        if (!cancelled) {
          const firstPaifu = payload.items[0];
          if (firstPaifu) {
            setPaifu(firstPaifu);
            setSelectedRoundIndex(getInitialRoundIndex(firstPaifu.rounds));
          } else {
            // Demo boundary: empty backend response falls back to local demo
            // data only so the page can be reviewed before the game engine
            // exists. Remove this branch when real paifu records are available.
            const demoPaifu = createDemoTablePaifu(tableId);
            setPaifu(demoPaifu);
            setSelectedRoundIndex(getInitialRoundIndex(demoPaifu.rounds));
            setError('No paifu record is available yet. Showing temporary demo data.');
          }
        }
      } catch (loadError) {
        if (!cancelled) {
          // Demo boundary: failed backend requests fall back to local demo data
          // for frontend-only review. Remove this fallback together with
          // `demo.ts` when local/dev backends can serve paifu records.
          const demoPaifu = createDemoTablePaifu(tableId);
          setPaifu(demoPaifu);
          setSelectedRoundIndex(getInitialRoundIndex(demoPaifu.rounds));
          setError(
            loadError instanceof ApiError
              ? `${loadError.message} Showing temporary demo data.`
              : loadError instanceof Error
                ? `${loadError.message} Showing temporary demo data.`
                : 'Failed to load paifu details. Showing temporary demo data.',
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
      setError('Missing table id.');
      setIsLoading(false);
    }

    return () => {
      cancelled = true;
    };
  }, [tableId]);

  const rounds = useMemo(() => paifu?.rounds ?? [], [paifu]);
  const selectedRound = rounds[Math.min(selectedRoundIndex, Math.max(rounds.length - 1, 0))];

  if (isLoading) {
    return (
      <section className="grid gap-6">
        <LoadingProgress
          label="Loading paifu"
          message="Fetching the archived match record and round summaries."
        />
      </section>
    );
  }

  if (!paifu || !selectedRound) {
    return (
      <section className="grid min-h-[60vh] place-items-center text-[#c7d6e2]">
        <div className="rounded-[20px] border border-[rgba(176,223,229,0.14)] bg-[rgba(7,18,28,0.72)] px-5 py-4">
          {error ?? 'No paifu data is available.'}
        </div>
      </section>
    );
  }

  return (
    <section className="mt-[14px] grid gap-0">
      <PaifuHandTable
        onSelectRound={setSelectedRoundIndex}
        paifu={paifu}
        round={selectedRound}
        rounds={rounds}
        selectedRoundIndex={selectedRoundIndex}
      />
    </section>
  );
}
