import { Injectable, effect, signal } from '@angular/core';
import { LANGUAGE_STORAGE_KEY } from '../api.constant';
import { TRANSLATIONS } from './translations.constant';
import { Language } from './language.enum';
import { resolveInitialLanguage } from './initial-language';
import { TranslationKey } from './translation-key.type';

@Injectable({ providedIn: 'root' })
export class LanguageService {
  readonly currentLanguage = signal(
    resolveInitialLanguage(localStorage.getItem(LANGUAGE_STORAGE_KEY), navigator.languages ?? []),
  );

  constructor() {
    effect(() => {
      document.documentElement.lang = this.currentLanguage();
    });
  }

  setLanguage(language: Language): void {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    this.currentLanguage.set(language);
  }
  translate(key: TranslationKey): string {
    return TRANSLATIONS[this.currentLanguage()][key];
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.currentLanguage(), { maximumFractionDigits: 1 }).format(value);
  }
}
