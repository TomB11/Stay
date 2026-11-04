import { TranslationKey } from '../core/i18n/translation-key.type';

export type LegalPageId = 'privacy' | 'terms';

export interface LegalSection {
  titleKey: TranslationKey;
  bodyKey: TranslationKey;
}

export interface LegalPage {
  eyebrowKey: TranslationKey;
  titleKey: TranslationKey;
  introKey: TranslationKey;
  sections: readonly LegalSection[];
}
