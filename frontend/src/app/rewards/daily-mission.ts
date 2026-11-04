import { DAILY_MISSIONS, DailyMission } from './constants/daily-missions.constant';

const DAY_MS = 86_400_000;

/** Start of the user's local day, sent to the API so "today" respects the time zone. */
export function startOfLocalDay(now: Date): Date {
  return new Date(now.getFullYear(), now.getMonth(), now.getDate());
}

/** Rotates through the missions by calendar day, so it is stable during the day. */
export function pickDailyMission(now: Date): DailyMission {
  const localDays = Math.floor(Date.UTC(now.getFullYear(), now.getMonth(), now.getDate()) / DAY_MS);
  return DAILY_MISSIONS[localDays % DAILY_MISSIONS.length];
}
