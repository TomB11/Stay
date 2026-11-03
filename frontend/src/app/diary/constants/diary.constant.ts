import { TranslationKey } from '../../core/i18n/translation-key.type';

export const DIARY_MAX_TEXT_LENGTH = 2000;
export const DIARY_MAX_EMOTION_LENGTH = 100;
export const DIARY_DEFAULT_INTENSITY = 5;

/** Common emotions offered as quick picks; the user can still type their own. */
export const DIARY_EMOTIONS: readonly TranslationKey[] = [
  'emotionFear',
  'emotionWorry',
  'emotionSadness',
  'emotionAnger',
  'emotionShame',
  'emotionGuilt',
];
