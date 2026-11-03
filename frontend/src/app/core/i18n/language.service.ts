import { Injectable, signal } from '@angular/core';
import { TRANSLATIONS } from './translations.constant';
import { Language } from './language.enum';
import { TranslationKey } from './translation-key.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLanguage = signal(Language.English);

  setLanguage(language: Language): void {
    this.currentLanguage.set(language);
  }
  translate(key: TranslationKey): string {
    return TRANSLATIONS[this.currentLanguage()][key];
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.currentLanguage(), { maximumFractionDigits: 1 }).format(value);
  }
}
