export interface RewardView {
  id: string;
  /** Hidden (null) while the gift is still wrapped. */
  title: string | null;
  openedAt: string | null;
  redeemedAt: string | null;
}

export interface ActionsToday {
  sessions: number;
  diaryEntries: number;
  exposureAttempts: number;
}

export interface LadderStats {
  attempts: number;
  masteredSteps: number;
  highestMasteredAnxiety: number;
}

export interface RewardsOverview {
  actions: number;
  actionsToday: ActionsToday;
  ladder: LadderStats;
  giftsEarned: number;
  giftsAvailable: number;
  actionsToNextGift: number;
  actionsPerGift: number;
  rewards: RewardView[];
}

export interface OpenedReward {
  id: string;
  title: string;
}
