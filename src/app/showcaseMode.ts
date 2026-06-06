import { useEffect, useState } from 'react';

const showcaseModeStorageKey = 'riichi-nexus-showcase-mode';
const showcaseModeChangeEvent = 'riichi-nexus-showcase-mode-change';

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

  if (enabled) {
    window.localStorage.setItem(showcaseModeStorageKey, 'enabled');
  } else {
    window.localStorage.removeItem(showcaseModeStorageKey);
  }

  window.dispatchEvent(new Event(showcaseModeChangeEvent));
}

export function useShowcaseMode() {
  const [enabled, setEnabled] = useState(isShowcaseModeEnabled);

  useEffect(() => {
    const sync = () => setEnabled(isShowcaseModeEnabled());

    window.addEventListener(showcaseModeChangeEvent, sync);
    window.addEventListener('storage', sync);

    return () => {
      window.removeEventListener(showcaseModeChangeEvent, sync);
      window.removeEventListener('storage', sync);
    };
  }, []);

  return [enabled, setShowcaseModeEnabled] as const;
}
