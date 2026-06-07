import { useEffect, useState } from 'react';

import {
  MahjongCoreGetShowcaseModeAPI,
  MahjongCoreSetShowcaseModeAPI,
} from '@/api/tournament/mahjongcore';
import { sendAPI } from '@/system/api';

const showcaseModeStorageKey = 'riichi-nexus-showcase-mode';
const showcaseModeChangeEvent = 'riichi-nexus-showcase-mode-change';
const showcaseModeSyncIntervalMs = 5000;

export function isShowcaseModeEnabled() {
  if (typeof window === 'undefined') {
    return false;
  }

  return window.localStorage.getItem(showcaseModeStorageKey) === 'enabled';
}

export function setShowcaseModeEnabled(enabled: boolean) {
  if (typeof window === 'undefined') {
    return;
  }

  applyShowcaseModeEnabled(enabled);
  void sendAPI(new MahjongCoreSetShowcaseModeAPI({ enabled }))
    .then((payload) => {
      applyShowcaseModeEnabled(payload.enabled);
    })
    .catch(() => {
      void syncShowcaseModeFromBackend();
    });
}

export async function syncShowcaseModeFromBackend() {
  if (typeof window === 'undefined') {
    return false;
  }

  const payload = await sendAPI(new MahjongCoreGetShowcaseModeAPI());
  applyShowcaseModeEnabled(payload.enabled);

  return payload.enabled;
}

function applyShowcaseModeEnabled(enabled: boolean) {
  const previous = isShowcaseModeEnabled();

  if (enabled) {
    window.localStorage.setItem(showcaseModeStorageKey, 'enabled');
  } else {
    window.localStorage.removeItem(showcaseModeStorageKey);
  }

  if (previous !== enabled) {
    window.dispatchEvent(new Event(showcaseModeChangeEvent));
  }
}

export function useShowcaseMode() {
  const [enabled, setEnabled] = useState(isShowcaseModeEnabled);

  useEffect(() => {
    const sync = () => setEnabled(isShowcaseModeEnabled());
    const syncFromBackend = () => {
      void syncShowcaseModeFromBackend().catch(sync);
    };

    window.addEventListener(showcaseModeChangeEvent, sync);
    window.addEventListener('storage', sync);
    window.addEventListener('focus', syncFromBackend);
    syncFromBackend();
    const timer = window.setInterval(
      syncFromBackend,
      showcaseModeSyncIntervalMs,
    );

    return () => {
      window.clearInterval(timer);
      window.removeEventListener(showcaseModeChangeEvent, sync);
      window.removeEventListener('storage', sync);
      window.removeEventListener('focus', syncFromBackend);
    };
  }, []);

  return [enabled, setShowcaseModeEnabled] as const;
}
