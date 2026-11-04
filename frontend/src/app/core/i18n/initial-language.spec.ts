import { Language } from './language.enum';
import { resolveInitialLanguage } from './initial-language';

describe('resolveInitialLanguage', () => {
  it('prefers a valid stored language', () => {
    expect(resolveInitialLanguage('cs-CZ', ['sk-SK'])).toBe(Language.Czech);
  });

  it('ignores an invalid stored value and uses the browser language', () => {
    expect(resolveInitialLanguage('xx', ['de-DE', 'sk'])).toBe(Language.Slovak);
  });

  it('falls back to English', () => {
    expect(resolveInitialLanguage(null, ['de-DE'])).toBe(Language.English);
  });
});
