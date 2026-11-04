import { TranslationKey } from '../../core/i18n/translation-key.type';
import { DashboardTab } from '../models/dashboard-tab.type';

export interface DashboardTabItem {
  id: DashboardTab;
  icon: string;
  labelKey: TranslationKey;
}

export const DASHBOARD_TABS: readonly DashboardTabItem[] = [
  { id: 'mission', icon: '🎯', labelKey: 'tabMission' },
  { id: 'rewards', icon: '🎁', labelKey: 'tabRewards' },
  { id: 'ladder', icon: '🪜', labelKey: 'tabLadder' },
];
