import { TranslationKey } from '../../core/i18n/translation-key.type';

export interface UserNavLink {
  path: string;
  labelKey: TranslationKey;
}

/** Pages available to signed-in users, in navigation order. */
export const USER_NAV_LINKS: readonly UserNavLink[] = [
  { path: '/progress', labelKey: 'progressNav' },
  { path: '/ladder', labelKey: 'ladderNav' },
  { path: '/diary', labelKey: 'diaryNav' },
  { path: '/history', labelKey: 'navHistory' },
  { path: '/profile', labelKey: 'navProfile' },
];
