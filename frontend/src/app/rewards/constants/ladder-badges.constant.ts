import { TranslationKey } from '../../core/i18n/translation-key.type';
import { LadderStats } from '../models/rewards.interface';

/** Everything a badge can level up on. */
export type BadgeStats = LadderStats & { actions: number; sessions: number; diaryEntries: number };

export interface BadgeTrack {
  id: string;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  /** Reads the value this badge levels up on. */
  value: (stats: BadgeStats) => number;
  /** Minimum value that reaches level 1, 2, 3, ... of the badge. */
  levels: readonly number[];
}

export const BADGE_TIER_KEYS: readonly TranslationKey[] = [
  'badgeTierBronze',
  'badgeTierSilver',
  'badgeTierGold',
  'badgeTierPlatinum',
  'badgeTierDiamond',
];

export const LADDER_BADGES: readonly BadgeTrack[] = [
  {
    id: 'courage',
    icon: '👣',
    titleKey: 'badgeCourageTitle',
    descriptionKey: 'badgeCourageDesc',
    value: (stats) => stats.attempts,
    levels: [1, 5, 15, 30, 60],
  },
  {
    id: 'overcoming',
    icon: '🌱',
    titleKey: 'badgeOvercomingTitle',
    descriptionKey: 'badgeOvercomingDesc',
    value: (stats) => stats.masteredSteps,
    levels: [1, 3, 6, 12, 24],
  },
  {
    id: 'brave-heart',
    icon: '🦁',
    titleKey: 'badgeBraveTitle',
    descriptionKey: 'badgeBraveDesc',
    value: (stats) => stats.highestMasteredAnxiety,
    levels: [3, 5, 7, 8, 9],
  },
  {
    id: 'persistence',
    icon: '🔥',
    titleKey: 'badgePersistenceTitle',
    descriptionKey: 'badgePersistenceDesc',
    value: (stats) => stats.actions,
    levels: [5, 15, 40, 80, 150],
  },
{
    id: 'calm',
    icon: '🌬️',
    titleKey: 'badgeCalmTitle',
    descriptionKey: 'badgeCalmDesc',
    value: (stats) => stats.sessions,
    levels: [1, 5, 15, 40, 80],
  },
  {
    id: 'insight',
    icon: '📖',
    titleKey: 'badgeInsightTitle',
    descriptionKey: 'badgeInsightDesc',
    value: (stats) => stats.diaryEntries,
    levels: [1, 5, 15, 40, 80],
  },
];

/** Returns the reached level (0 = locked) and the value needed for the next one. */
export function badgeLevelFor(
  track: BadgeTrack,
  stats: BadgeStats,
): { level: number; value: number; next: number | null } {
  const value = track.value(stats);
  const level = track.levels.filter((threshold) => value >= threshold).length;
  return { level, value, next: track.levels[level] ?? null };
}