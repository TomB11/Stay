import { TranslationKey } from '../../core/i18n/translation-key.type';
import { SessionPhase } from '../models/session-phase.type';

export interface SituationPrompts {
  placeholders: readonly TranslationKey[];
  starters: readonly TranslationKey[];
}

/** Example placeholders and starter phrases tailored to what the user is going through. */
export const SITUATION_PROMPTS: Record<SessionPhase, SituationPrompts> = {
  before: {
    placeholders: ['phPlaceholderBefore1', 'phPlaceholderBefore2', 'phPlaceholderBefore3'],
    starters: ['phStarterBefore1', 'phStarterBefore2', 'phStarterBefore3', 'phStarterBefore4'],
  },
  now: {
    placeholders: ['phPlaceholderNow1', 'phPlaceholderNow2', 'phPlaceholderNow3'],
    starters: ['phStarterNow1', 'phStarterNow2', 'phStarterNow3', 'phStarterNow4'],
  },
  after: {
    placeholders: ['phPlaceholderAfter1', 'phPlaceholderAfter2', 'phPlaceholderAfter3'],
    starters: ['phStarterAfter1', 'phStarterAfter2', 'phStarterAfter3', 'phStarterAfter4'],
  },
  unsure: {
    placeholders: ['phPlaceholderUnsure1', 'phPlaceholderUnsure2', 'phPlaceholderUnsure3'],
    starters: ['phStarterUnsure1', 'phStarterUnsure2', 'phStarterUnsure3', 'phStarterUnsure4'],
  },
};