import { TranslationKey } from '../../core/i18n/translation-key.type';

export interface PageContent {
  eyebrowKey: TranslationKey;
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  panelTitleKey: TranslationKey;
  panelTextKey: TranslationKey;
  isHistory?: boolean;
  isProfile?: boolean;
  isLadder?: boolean;
  isDiary?: boolean;
}
