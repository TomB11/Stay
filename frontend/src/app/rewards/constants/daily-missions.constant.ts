import { TranslationKey } from '../../core/i18n/translation-key.type';
import { ActionsToday } from '../models/rewards.interface';

export interface DailyMission {
  titleKey: TranslationKey;
  descriptionKey: TranslationKey;
  counter: keyof ActionsToday;
  link: string;
}

export const DAILY_MISSIONS: readonly DailyMission[] = [
  {
    titleKey: 'missionSessionTitle',
    descriptionKey: 'missionSessionDesc',
    counter: 'sessions',
    link: '/now',
  },
  {
    titleKey: 'missionDiaryTitle',
    descriptionKey: 'missionDiaryDesc',
    counter: 'diaryEntries',
    link: '/diary',
  },
  {
    titleKey: 'missionLadderTitle',
    descriptionKey: 'missionLadderDesc',
    counter: 'exposureAttempts',
    link: '/ladder',
  },
];
