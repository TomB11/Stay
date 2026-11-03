import { PhaseGuidance } from '../models/phase-guidance.interface';
import { SessionPhase } from '../models/session-phase.type';

export const PHASE_GUIDANCE: Record<SessionPhase, PhaseGuidance> = {
  before: {
    labelKey: 'before',
    titleKey: 'beforeTitle',
    promptKey: 'beforePrompt',
    actionKey: 'firstStep',
  },
  now: {
    labelKey: 'now',
    titleKey: 'nowTitle',
    promptKey: 'nowPrompt',
    actionKey: 'paused',
  },
  after: {
    labelKey: 'after',
    titleKey: 'afterTitle',
    promptKey: 'afterPrompt',
    actionKey: 'factDifference',
  },
  unsure: {
    labelKey: 'unsure',
    titleKey: 'unsureTitle',
    promptKey: 'unsurePrompt',
    actionKey: 'tookMoment',
  },
};
