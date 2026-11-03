import { TranslationKey } from '../../core/i18n/translation-key.type';

export type GuidedStepKind = 'text' | 'choice';

export interface GuidedStep {
  id: string;
  kind: GuidedStepKind;
  promptKey: TranslationKey;
  optionKeys?: readonly TranslationKey[];
}
