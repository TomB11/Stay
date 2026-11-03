import { detectCrisis } from './crisis-detector';

describe('detectCrisis', () => {
  it('detects Slovak, Czech and English signals regardless of diacritics and case', () => {
    const signals = [
      'Chcem sa ZABIŤ',
      'chcem sa zabit',
      'Zabijem sa',
      'Chci se zabít',
      'Nechci už žít',
      'Nechcem uz zit',
      'myslím na samovraždu',
      'I want to die',
      "I don't want to live anymore",
      'I keep thinking about self-harm',
      'mám bolesť na hrudi',
      'I want to hurt myself',
    ];
    for (const text of signals) {
      expect(detectCrisis(text)).withContext(text).toBeTrue();
    }
  });

  it('ignores ordinary anxiety text', () => {
    const safe = [
      '',
      '   ',
      'Zajtra mám prezentáciu a bojím sa, že sa zosmiešnim.',
      'Mám strach z pohovoru, ale zvládnem to.',
      'I am nervous about the exam tomorrow.',
      'Chcem žiť pokojnejšie a menej sa báť.',
    ];
    for (const text of safe) {
      expect(detectCrisis(text)).withContext(text).toBeFalse();
    }
  });
});
