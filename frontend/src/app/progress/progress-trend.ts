import { TranslationKey } from '../core/i18n/translation-key.type';
import { Insights } from './models/insights.interface';

/** Differences below this many points are shown as "stable". */
export const TREND_STABLE_DELTA = 0.5;

export type TrendDirection = 'down' | 'up' | 'stable' | 'unknown';

export const TREND_MESSAGE: Record<TrendDirection, TranslationKey> = {
  down: 'progressTrendDown',
  up: 'progressTrendUp',
  stable: 'progressTrendStable',
  unknown: 'progressNotEnough',
};

export function trendDirection(averages: Insights['averageIntensity']): TrendDirection {
  const { last7Days, previous7Days } = averages;
  if (last7Days === null || previous7Days === null) return 'unknown';
  const delta = last7Days - previous7Days;
  if (delta <= -TREND_STABLE_DELTA) return 'down';
  if (delta >= TREND_STABLE_DELTA) return 'up';
  return 'stable';
}
