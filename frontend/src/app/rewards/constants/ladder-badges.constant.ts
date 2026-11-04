import { TranslationKey } from '../../core/i18n/translation-key.type';
import { LadderStats } from '../models/rewards.interface';

export interface LadderBadge {
  id: string;
  icon: string;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  isEarned: (ladder: LadderStats) => boolean;
}

/** Highest expected anxiety from which a mastered step counts as a "brave" one. */
export const BRAVE_STEP_ANXIETY = 7;

export const LADDER_BADGES: readonly LadderBadge[] = [
  {
    id: 'first-attempt',
    icon: '👣',
    titleKey: 'badgeFirstAttemptTitle',
    descriptionKey: 'badgeFirstAttemptDesc',
    isEarned: (ladder) => ladder.attempts >= 1,
  },
  {
    id: 'five-attempts',
    icon: '🥾',
    titleKey: 'badgeFiveAttemptsTitle',
    descriptionKey: 'badgeFiveAttemptsDesc',
    isEarned: (ladder) => ladder.attempts >= 5,
  },
  {
    id: 'ten-attempts',
    icon: '🧗',
    titleKey: 'badgeTenAttemptsTitle',
    descriptionKey: 'badgeTenAttemptsDesc',
    isEarned: (ladder) => ladder.attempts >= 10,
  },
  {
    id: 'first-mastered',
    icon: '🌱',
    titleKey: 'badgeFirstMasteredTitle',
    descriptionKey: 'badgeFirstMasteredDesc',
    isEarned: (ladder) => ladder.masteredSteps >= 1,
  },
  {
    id: 'three-mastered',
    icon: '🌿',
    titleKey: 'badgeThreeMasteredTitle',
    descriptionKey: 'badgeThreeMasteredDesc',
    isEarned: (ladder) => ladder.masteredSteps >= 3,
  },
  {
    id: 'brave-step',
    icon: '🦁',
    titleKey: 'badgeBraveTitle',
    descriptionKey: 'badgeBraveDesc',
    isEarned: (ladder) => ladder.highestMasteredAnxiety >= BRAVE_STEP_ANXIETY,
  },
];
