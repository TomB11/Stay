import { LegalPage, LegalPageId } from './legal-page.interface';

export const LEGAL_PAGES: Record<LegalPageId, LegalPage> = {
  privacy: {
    eyebrowKey: 'legalEyebrow',
    titleKey: 'privacyTitle',
    introKey: 'privacyIntro',
    sections: [
      { titleKey: 'privacyS1Title', bodyKey: 'privacyS1Body' },
      { titleKey: 'privacyS2Title', bodyKey: 'privacyS2Body' },
      { titleKey: 'privacyS3Title', bodyKey: 'privacyS3Body' },
      { titleKey: 'privacyS4Title', bodyKey: 'privacyS4Body' },
      { titleKey: 'privacyS5Title', bodyKey: 'privacyS5Body' },
      { titleKey: 'privacyS6Title', bodyKey: 'privacyS6Body' },
    ],
  },
  terms: {
    eyebrowKey: 'legalEyebrow',
    titleKey: 'termsTitle',
    introKey: 'termsIntro',
    sections: [
      { titleKey: 'termsS1Title', bodyKey: 'termsS1Body' },
      { titleKey: 'termsS2Title', bodyKey: 'termsS2Body' },
      { titleKey: 'termsS3Title', bodyKey: 'termsS3Body' },
      { titleKey: 'termsS4Title', bodyKey: 'termsS4Body' },
      { titleKey: 'termsS5Title', bodyKey: 'termsS5Body' },
    ],
  },
};
