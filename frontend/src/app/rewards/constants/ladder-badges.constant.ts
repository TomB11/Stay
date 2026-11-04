import { TranslationKey } from '../../core/i18n/translation-key.type';
import { LadderStats } from '../models/rewards.interface';

export interface BadgeTrack {
  id: string;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  /** Reads the value this badge levels up on. */
  value: (ladder: LadderStats) => number;
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
    value: (ladder) => ladder.attempts,
    levels: [1, 5, 15, 30, 60],
  },
  {
    id: 'overcoming',
    icon: '🌱',
    titleKey: 'badgeOvercomingTitle',
    descriptionKey: 'badgeOvercomingDesc',
    value: (ladder) => ladder.masteredSteps,
    levels: [1, 3, 6, 12, 24],
  },
  {
    id: 'brave-heart',
    icon: '🦁',
    titleKey: 'badgeBraveTitle',
    descriptionKey: 'badgeBraveDesc',
    value: (ladder) => ladder.highestMasteredAnxiety,
    levels: [3, 5, 7, 8, 9],
  },
];

/** Returns the reached level (0 = locked) and the value needed for the next one. */
export function badgeLevelFor(
  track: BadgeTrack,
  ladder: LadderStats,
): { level: number; value: number; next: number | null } {
  const value = track.value(ladder);
  const level = track.levels.filter((threshold) => value >= threshold).length;
  return { level, value, next: track.levels[level] ?? null };
}