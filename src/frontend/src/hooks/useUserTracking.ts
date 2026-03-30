import { useCallback, useEffect } from "react";

export interface TrackingEvent {
  userId: string;
  eventType: string;
  toolName?: string;
  timestamp: number;
}

function getEventsKey(userId: string) {
  return `finhealth_events_${userId}`;
}

function loadEvents(userId: string): TrackingEvent[] {
  try {
    const raw = localStorage.getItem(getEventsKey(userId));
    if (raw) return JSON.parse(raw) as TrackingEvent[];
  } catch {}
  return [];
}

function saveEvents(userId: string, events: TrackingEvent[]) {
  localStorage.setItem(getEventsKey(userId), JSON.stringify(events));
}

export function useUserTracking(userId: string) {
  useEffect(() => {
    const metaKey = `finhealth_user_meta_${userId}`;
    const existing = localStorage.getItem(metaKey);
    let meta: Record<string, unknown> = {};
    if (existing) {
      try {
        meta = JSON.parse(existing);
      } catch {}
    }
    meta.lastLogin = Date.now();
    localStorage.setItem(metaKey, JSON.stringify(meta));
  }, [userId]);

  const trackEvent = useCallback(
    (eventType: string, toolName?: string) => {
      const events = loadEvents(userId);
      events.push({ userId, eventType, toolName, timestamp: Date.now() });
      // Keep last 500 events to avoid unbounded growth
      if (events.length > 500) events.splice(0, events.length - 500);
      saveEvents(userId, events);
    },
    [userId],
  );

  const getRecentEvents = useCallback(
    (days: number): TrackingEvent[] => {
      const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;
      return loadEvents(userId).filter((e) => e.timestamp >= cutoff);
    },
    [userId],
  );

  return { trackEvent, getRecentEvents };
}
