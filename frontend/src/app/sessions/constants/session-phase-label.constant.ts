import { TranslationKey } from '../../core/i18n/translation-key.type';
import { SessionPhase } from '../models/session-phase.type';

export const SESSION_PHASE_LABEL: Record<SessionPhase, TranslationKey> = {
  before: 'before',
  now: 'now',
  after: 'after',
  unsure: 'unsure',
};
