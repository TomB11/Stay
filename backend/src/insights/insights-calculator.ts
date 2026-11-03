import {
  HELP_HIGH_AVERAGE,
  HELP_MIN_READINGS,
  HELP_RISING_DELTA,
  HELP_RISING_MIN_AVERAGE,
  HELP_WINDOW_DAYS,
  MIN_READINGS_PER_WINDOW,
  MS_PER_DAY,
  TREND_WINDOW_DAYS,
} from './constants/insights.constant.js';
import type {
  HelpReason,
  Insights,
  InsightsInput,
  PhaseReduction,
} from './models/insights.interface.js';

interface Reading {
  at: number;
  intensity: number;
}

function average(values: number[]): number | null {
  if (!values.length) return null;
  const mean = values.reduce((sum, value) => sum + value, 0) / values.length;
  return Math.round(mean * 10) / 10;
}

function windowAverage(readings: Reading[], from: number, to: number, minimum: number): number | null {
  const values = readings.filter((r) => r.at > from && r.at <= to).map((r) => r.intensity);
  return values.length >= minimum ? average(values) : null;
}

function dayKey(timestamp: number): string {
  return new Date(timestamp).toISOString().slice(0, 10);
}

/** Counts consecutive days with any activity, ending today or yesterday (UTC days). */
function streakDays(timestamps: number[], now: number): number {
  const days = new Set(timestamps.map(dayKey));
  let cursor = now;
  if (!days.has(dayKey(cursor))) cursor -= MS_PER_DAY;
  let streak = 0;
  while (days.has(dayKey(cursor))) {
    streak++;
    cursor -= MS_PER_DAY;
  }
  return streak;
}

function suggestHelp(
  readings: Reading[],
  now: number,
  last7: number | null,
  previous7: number | null,
): HelpReason | null {
  const recent = readings.filter((r) => r.at > now - HELP_WINDOW_DAYS * MS_PER_DAY && r.at <= now);
  const recentAverage = average(recent.map((r) => r.intensity));
  if (recent.length >= HELP_MIN_READINGS && recentAverage !== null && recentAverage >= HELP_HIGH_AVERAGE) {
    return 'high';
  }
  if (
    last7 !== null &&
    previous7 !== null &&
    last7 >= HELP_RISING_MIN_AVERAGE &&
    last7 - previous7 >= HELP_RISING_DELTA
  ) {
    return 'rising';
  }
  return null;
}

/** Derives progress statistics from stored records; no data leaves the server. */
export function calculateInsights(input: InsightsInput, now: Date = new Date()): Insights {
  const nowMs = now.getTime();
  const { sessions, diaryEntries } = input;

  const readings: Reading[] = [
    ...sessions.map((s) => ({ at: Date.parse(s.createdAt), intensity: s.initialIntensity })),
    ...diaryEntries.map((d) => ({ at: Date.parse(d.createdAt), intensity: d.intensityBefore })),
  ];
  const windowMs = TREND_WINDOW_DAYS * MS_PER_DAY;
  const last7Days = windowAverage(readings, nowMs - windowMs, nowMs, MIN_READINGS_PER_WINDOW);
  const previous7Days = windowAverage(readings, nowMs - 2 * windowMs, nowMs - windowMs, MIN_READINGS_PER_WINDOW);

  const sessionDrops = sessions.map((s) => s.initialIntensity - s.finalIntensity);
  const diaryDrops = diaryEntries.map((d) => d.intensityBefore - d.intensityAfter);

  const phases = [...new Set(sessions.map((s) => s.phase))];
  const reductionByPhase: PhaseReduction[] = phases.map((phase) => {
    const drops = sessions
      .filter((s) => s.phase === phase)
      .map((s) => s.initialIntensity - s.finalIntensity);
    return { phase, count: drops.length, averageReduction: average(drops) ?? 0 };
  });

  const helpful = sessions.filter((s) => s.feedback !== 'no').length;
  const activity = [
    ...readings.map((r) => r.at),
    ...input.exposureAttemptDates.map((date) => Date.parse(date)),
  ];

  return {
    totalRecords: sessions.length + diaryEntries.length,
    averageIntensity: { last7Days, previous7Days },
    sessionReduction: { count: sessionDrops.length, average: average(sessionDrops) },
    reductionByPhase,
    diaryReduction: { count: diaryDrops.length, average: average(diaryDrops) },
    helpfulRate: sessions.length ? Math.round((helpful / sessions.length) * 100) : null,
    exposure: input.exposure,
    streakDays: streakDays(activity, nowMs),
    suggestProfessionalHelp: suggestHelp(readings, nowMs, last7Days, previous7Days),
  };
}
