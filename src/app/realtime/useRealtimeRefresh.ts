import { useEffect } from 'react';

import {
  realtimeBrowserEventName,
  type RealtimeBrowserEvent,
  type RealtimeEvent,
} from './RealtimeEvent';

export function useRealtimeRefresh(
  eventTypes: string[],
  onRefresh: (event: RealtimeEvent) => void,
) {
  const eventTypeKey = eventTypes.join('|');

  useEffect(() => {
    const allowedEventTypes = new Set(
      eventTypeKey.split('|').filter(Boolean),
    );

    const handleRealtimeEvent = (event: Event) => {
      const realtimeEvent = (event as RealtimeBrowserEvent).detail;

      if (allowedEventTypes.has(realtimeEvent.eventType)) {
        onRefresh(realtimeEvent);
      }
    };

    window.addEventListener(realtimeBrowserEventName, handleRealtimeEvent);

    return () => {
      window.removeEventListener(realtimeBrowserEventName, handleRealtimeEvent);
    };
  }, [eventTypeKey, onRefresh]);
}
