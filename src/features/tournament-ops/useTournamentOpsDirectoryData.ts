import { useEffect, useState } from 'react';

import {
  loadTournamentDirectory,
  type TournamentDirectoryState,
} from './data';

export function useTournamentOpsDirectoryData(reloadKey = 0) {
  const [directory, setDirectory] = useState<TournamentDirectoryState | null>(null);
  const [isLoadingDirectory, setIsLoadingDirectory] = useState(true);

  useEffect(() => {
    let cancelled = false;

    void (async () => {
      setIsLoadingDirectory(true);
      const nextDirectory = await loadTournamentDirectory();

      if (!cancelled) {
        setDirectory(nextDirectory);
        setIsLoadingDirectory(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [reloadKey]);

  return { directory, isLoadingDirectory };
}
