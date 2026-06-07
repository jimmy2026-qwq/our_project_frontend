import { afterEach, describe, expect, it, vi } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import {
  isShowcaseModeEnabled,
  setShowcaseModeEnabled,
  useShowcaseMode,
} from '@/app/showcaseMode';

function createLocalStorageMock() {
  const store = new Map<string, string>();

  return {
    getItem: vi.fn((key: string) => store.get(key) ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store.set(key, value);
    }),
    removeItem: vi.fn((key: string) => {
      store.delete(key);
    }),
  };
}

describe('showcase mode helpers', () => {
  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it('stays disabled outside browser environments', () => {
    vi.unstubAllGlobals();

    expect(isShowcaseModeEnabled()).toBe(false);
    expect(() => setShowcaseModeEnabled(true)).not.toThrow();
  });

  it('persists showcase mode in local storage and dispatches sync events', () => {
    const dispatchEvent = vi.fn();
    const localStorage = createLocalStorageMock();

    vi.stubGlobal('window', {
      dispatchEvent,
      localStorage,
    });

    expect(isShowcaseModeEnabled()).toBe(false);

    setShowcaseModeEnabled(true);

    expect(localStorage.setItem).toHaveBeenCalledWith(
      'riichi-nexus-showcase-mode',
      'enabled',
    );
    expect(dispatchEvent).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'riichi-nexus-showcase-mode-change' }),
    );
    expect(isShowcaseModeEnabled()).toBe(true);

    setShowcaseModeEnabled(false);

    expect(localStorage.removeItem).toHaveBeenCalledWith(
      'riichi-nexus-showcase-mode',
    );
    expect(isShowcaseModeEnabled()).toBe(false);
  });

  it('initializes the showcase mode hook from storage', () => {
    vi.stubGlobal('window', {
      addEventListener: vi.fn(),
      localStorage: {
        getItem: vi.fn(() => 'enabled'),
      },
      removeEventListener: vi.fn(),
    });

    function Probe() {
      const [enabled] = useShowcaseMode();

      return createElement('span', null, enabled ? 'enabled' : 'disabled');
    }

    expect(renderToStaticMarkup(createElement(Probe))).toContain('enabled');
  });
});
