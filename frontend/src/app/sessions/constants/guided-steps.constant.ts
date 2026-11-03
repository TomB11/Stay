import { GuidedStep } from '../models/guided-step.interface';
import { SessionPhase } from '../models/session-phase.type';

/** Cognitive-behavioural exercises for the phases where the user can still reflect. */
export const GUIDED_STEPS: Partial<Record<SessionPhase, readonly GuidedStep[]>> = {
  before: [
    { id: 'fear', kind: 'text', promptKey: 'beforeFearPrompt' },
    {
      id: 'trap',
      kind: 'choice',
      promptKey: 'beforeTrapPrompt',
      optionKeys: ['trapCatastrophe', 'trapMindReading', 'trapCantCope', 'trapPerfect'],
    },
    { id: 'evidence', kind: 'text', promptKey: 'beforeEvidencePrompt' },
    { id: 'friend', kind: 'text', promptKey: 'beforeFriendPrompt' },
    { id: 'step', kind: 'text', promptKey: 'beforeStepPrompt' },
  ],
  after: [
    { id: 'expected', kind: 'text', promptKey: 'afterExpectedPrompt' },
    { id: 'facts', kind: 'text', promptKey: 'afterFactsPrompt' },
    { id: 'story', kind: 'text', promptKey: 'afterStoryPrompt' },
    { id: 'compassion', kind: 'text', promptKey: 'afterCompassionPrompt' },
    {
      id: 'letGo',
      kind: 'choice',
      promptKey: 'afterLetGoPrompt',
      optionKeys: ['letGoWalk', 'letGoMusic', 'letGoTalk', 'letGoRest'],
    },
  ],
};
