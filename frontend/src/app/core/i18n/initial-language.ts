import { Language } from './language.enum';

export const LANGUAGE_PREFIXES: Record<string, Language> = {
  sk: Language.Slovak,
  cs: Language.Czech,
  en: Language.English,
};

/** Returns the stored language if valid, otherwise the first supported browser language, otherwise English. */
export function resolveInitialLanguage(
  stored: string | null,
  browserLanguages: readonly string[],
): Language {
  const supported = Object.values(Language) as string[];
  if (stored && supported.includes(stored)) {
    return stored as Language;
  }
  for (const tag of browserLanguages) {
    const match = LANGUAGE_PREFIXES[tag.slice(0, 2).toLowerCase()];
    if (match) return match;
  }
  return Language.English;
}
