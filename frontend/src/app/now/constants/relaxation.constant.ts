import { TranslationKey } from '../../core/i18n/translation-key.type';

export const RELAXATION_GROUP_KEYS: readonly TranslationKey[] = [
  'relaxGroupHands',
  'relaxGroupShoulders',
  'relaxGroupFace',
  'relaxGroupBelly',
  'relaxGroupLegs',
];
export const RELAXATION_TENSE_SECONDS = 5;
export const RELAXATION_RELEASE_SECONDS = 10;
export const RELAXATION_GROUP_SECONDS =
  RELAXATION_TENSE_SECONDS + RELAXATION_RELEASE_SECONDS;
