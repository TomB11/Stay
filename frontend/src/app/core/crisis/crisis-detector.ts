import { CRISIS_PATTERNS } from './crisis-patterns.constant';

/** Lowercases and removes diacritics so "zabiť sa" and "zabit sa" match the same pattern. */
function normalize(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .replace(/[’`]/g, "'")
    .replace(/\s+/g, ' ');
}

/** Returns true when free text contains a signal of self-harm, suicide or a physical emergency. */
export function detectCrisis(text: string): boolean {
  if (!text.trim()) return false;
  const normalized = normalize(text);
  return CRISIS_PATTERNS.some((pattern) => pattern.test(normalized));
}
