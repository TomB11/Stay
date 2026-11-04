import { TranslationKey } from '../../core/i18n/translation-key.type';

export type DiaryPromptField = 'situation' | 'thought' | 'alternative';

export interface DiaryPrompts {
  /** Example placeholders; one is picked per visit so they do not repeat every time. */
  placeholders: readonly TranslationKey[];
  /** Starter phrases shown while the field is focused, so the user can type less. */
  starters: readonly TranslationKey[];
}

export const DIARY_PROMPTS: Record<DiaryPromptField, DiaryPrompts> = {
  situation: {
    placeholders: ['diaryPhSituation1', 'diaryPhSituation2', 'diaryPhSituation3', 'diaryPhSituation4'],
    starters: [
      'diaryStarterSituation1',
      'diaryStarterSituation2',
      'diaryStarterSituation3',
      'diaryStarterSituation4',
      'diaryStarterSituation5',
    ],
  },
  thought: {
    placeholders: ['diaryPhThought1', 'diaryPhThought2', 'diaryPhThought3', 'diaryPhThought4'],
    starters: [
      'diaryStarterThought1',
      'diaryStarterThought2',
      'diaryStarterThought3',
      'diaryStarterThought4',
    ],
  },
  alternative: {
    placeholders: ['diaryPhAlt1', 'diaryPhAlt2', 'diaryPhAlt3', 'diaryPhAlt4'],
    starters: ['diaryStarterAlt1', 'diaryStarterAlt2', 'diaryStarterAlt3', 'diaryStarterAlt4'],
  },
};