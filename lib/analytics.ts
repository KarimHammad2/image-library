import { v4 as uuid } from "uuid";
import { getAnalytics, saveAnalytics } from "./db";
import type { AnalyticsEvent, AnalyticsEventType } from "./types";

export async function logAnalyticsEvent(
  type: AnalyticsEventType,
  options?: { userId?: string; metadata?: Record<string, unknown> },
) {
  const events = await getAnalytics();
  const newEvent: AnalyticsEvent = {
    id: uuid(),
    type,
    userId: options?.userId,
    metadata: options?.metadata,
    timestamp: new Date().toISOString(),
  };

  events.push(newEvent);
  await saveAnalytics(events);
  return newEvent;
}

export async function getAnalyticsSummary() {
  const events = await getAnalytics();
  const byType: Record<string, number> = {};
  events.forEach((evt) => {
    byType[evt.type] = (byType[evt.type] || 0) + 1;
  });

  return {
    totalEvents: events.length,
    byType,
    recent: events.slice(-50).reverse(),
  };
}

