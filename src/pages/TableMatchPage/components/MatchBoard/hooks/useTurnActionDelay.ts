import { useEffect, useState } from 'react';

import { getCallMaskDelayMs } from '../functions/matchBoardTiming';

export function useTurnActionDelay(turnActionDelayKey: string | null) {
  const [delayedTurnActionKey, setDelayedTurnActionKey] = useState<
    string | null
  >(null);

  useEffect(() => {
    if (!turnActionDelayKey) {
      setDelayedTurnActionKey(null);
      return;
    }

    setDelayedTurnActionKey(turnActionDelayKey);
    const timer = window.setTimeout(() => {
      setDelayedTurnActionKey((currentKey) =>
        currentKey === turnActionDelayKey ? null : currentKey,
      );
    }, getCallMaskDelayMs());

    return () => {
      window.clearTimeout(timer);
    };
  }, [turnActionDelayKey]);

  return delayedTurnActionKey;
}
