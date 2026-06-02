import { useEffect, type ReactNode } from 'react';

import { useAuth } from '@/app/auth/useAuth';

import {
  realtimeBrowserEventName,
  type RealtimeEvent,
} from './RealtimeEvent';

export function RealtimeProvider({ children }: { children: ReactNode }) {
  const { isReady, session } = useAuth();

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const eventSource = new EventSource(
      getRealtimeStreamUrl(
        session?.user.operatorId ?? session?.user.userId ?? '',
      ),
    );

    const handleMessage = (message: MessageEvent<string>) => {
      const event = parseRealtimeEvent(message.data);

      if (!event) {
        return;
      }

      window.dispatchEvent(
        new CustomEvent(realtimeBrowserEventName, { detail: event }),
      );
    };

    eventSource.onmessage = handleMessage;

    return () => {
      eventSource.close();
    };
  }, [isReady, session?.user.operatorId, session?.user.userId]);

  return <>{children}</>;
}

function getRealtimeStreamUrl(operatorId: string) {
  const baseUrl =
    (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? '/api';
  const normalizedBaseUrl = baseUrl.replace(/\/$/, '');
  const url = new URL(
    `${normalizedBaseUrl}/realtime/stream`,
    window.location.origin,
  );

  if (operatorId) {
    url.searchParams.set('operatorId', operatorId);
  }

  return url.toString();
}

function parseRealtimeEvent(value: string): RealtimeEvent | null {
  try {
    const event = JSON.parse(value) as Partial<RealtimeEvent>;

    if (
      !event.id ||
      !event.eventType ||
      !event.aggregateType ||
      !event.aggregateId
    ) {
      return null;
    }

    return event as RealtimeEvent;
  } catch {
    return null;
  }
}
