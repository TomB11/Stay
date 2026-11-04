export interface Reward {
  id: string;
  /** Null while the gift is still wrapped. */
  title: string | null;
  openedAt: string | null;
  redeemedAt: string | null;
}

export interface RewardsOverview {
  actions: number;
  giftsEarned: number;
  giftsAvailable: number;
  actionsToNextGift: number;
  actionsPerGift: number;
  rewards: Reward[];
}

export interface OpenedReward {
  id: string;
  title: string;
}
