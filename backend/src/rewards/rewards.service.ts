import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import {
  GIFT_EVERY_ACTIONS,
  MAX_REWARDS_PER_USER,
} from './constants/rewards-limits.constant.js';
import { CreateRewardDto } from './dto/create-reward.dto.js';
import type {
  ActionsToday,
  LadderStats,
  OpenedReward,
  RewardsOverview,
  RewardView,
} from './models/rewards.interface.js';
import { MASTERED_ANXIETY } from '../insights/constants/insights.constant.js';

@Injectable()
export class RewardsService {
  constructor(private readonly database: DatabaseService) {}

  async getOverview(userId: string, since?: string): Promise<RewardsOverview> {
    const dayStart = this.parseSince(since);
    const [today] = await this.database.query<ActionsToday>(
      `SELECT
          (SELECT COUNT(*) FROM sessions WHERE user_id = $1 AND created_at >= $2)::int AS sessions,
          (SELECT COUNT(*) FROM diary_entries WHERE user_id = $1 AND created_at >= $2)::int AS "diaryEntries",
          (SELECT COUNT(*) FROM exposure_attempts WHERE user_id = $1 AND created_at >= $2)::int AS "exposureAttempts"`,
      [userId, dayStart],
    );
    const [attempts] = await this.database.query<{ count: number }>(
      'SELECT COUNT(*)::int AS count FROM exposure_attempts WHERE user_id = $1',
      [userId],
    );
    const [mastered] = await this.database.query<{ count: number; highest: number }>(
      `SELECT COUNT(*)::int AS count, COALESCE(MAX(s.expected_anxiety), 0)::int AS highest
       FROM exposure_steps s
       WHERE s.user_id = $1 AND (
         SELECT a.anxiety_after FROM exposure_attempts a
         WHERE a.step_id = s.id ORDER BY a.created_at DESC LIMIT 1
       ) <= $2`,
      [userId, MASTERED_ANXIETY],
    );
    const ladder: LadderStats = {
      attempts: attempts.count,
      masteredSteps: mastered.count,
      highestMasteredAnxiety: mastered.highest,
    };
    const [counts] = await this.database.query<{ actions: number }>(
      `SELECT (
          (SELECT COUNT(*) FROM sessions WHERE user_id = $1) +
          (SELECT COUNT(*) FROM diary_entries WHERE user_id = $1) +
          (SELECT COUNT(*) FROM exposure_attempts WHERE user_id = $1)
        )::int AS actions`,
      [userId],
    );
    const rows = await this.database.query<RewardView & { title: string }>(
      `SELECT id, title, opened_at AS "openedAt", redeemed_at AS "redeemedAt"
       FROM rewards WHERE user_id = $1 ORDER BY created_at ASC`,
      [userId],
    );
    const rewards = rows.map((row) => ({ ...row, title: row.openedAt ? row.title : null }));
    const giftsEarned = Math.floor(counts.actions / GIFT_EVERY_ACTIONS);
    const opened = rewards.filter((reward) => reward.openedAt).length;
    return {
      actions: counts.actions,
      actionsToday: today,
      ladder,
      giftsEarned,
      giftsAvailable: Math.max(0, giftsEarned - opened),
      actionsToNextGift: GIFT_EVERY_ACTIONS - (counts.actions % GIFT_EVERY_ACTIONS),
      actionsPerGift: GIFT_EVERY_ACTIONS,
      rewards,
    };
  }

  async create(userId: string, input: CreateRewardDto): Promise<RewardView> {
    const [{ count }] = await this.database.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM rewards WHERE user_id = $1',
      [userId],
    );
    if (Number(count) >= MAX_REWARDS_PER_USER) {
      throw new BadRequestException('Too many rewards.');
    }
    const id = crypto.randomUUID();
    await this.database.query(
      'INSERT INTO rewards (id, user_id, title, created_at) VALUES ($1, $2, $3, $4)',
      [id, userId, input.title.trim(), new Date().toISOString()],
    );
    return { id, title: null, openedAt: null, redeemedAt: null };
  }

  /** Opens a random wrapped gift, but only if the user has earned one. */
  async open(userId: string): Promise<OpenedReward> {
    const overview = await this.getOverview(userId);
    if (overview.giftsAvailable < 1) {
      throw new BadRequestException('No gift to open yet.');
    }
    const [reward] = await this.database.query<OpenedReward>(
      `UPDATE rewards SET opened_at = $2
       WHERE id = (
         SELECT id FROM rewards
         WHERE user_id = $1 AND opened_at IS NULL
         ORDER BY random() LIMIT 1
       )
       RETURNING id, title`,
      [userId, new Date().toISOString()],
    );
    if (!reward) throw new BadRequestException('No wrapped rewards left.');
    return reward;
  }

  async redeem(userId: string, rewardId: string): Promise<void> {
    const rows = await this.database.query(
      `UPDATE rewards SET redeemed_at = $3
       WHERE id = $1 AND user_id = $2 AND opened_at IS NOT NULL
       RETURNING id`,
      [rewardId, userId, new Date().toISOString()],
    );
    if (!rows.length) throw new NotFoundException('Reward not found.');
  }

  async remove(userId: string, rewardId: string): Promise<void> {
    const rows = await this.database.query(
      'DELETE FROM rewards WHERE id = $1 AND user_id = $2 RETURNING id',
      [rewardId, userId],
    );
    if (!rows.length) throw new NotFoundException('Reward not found.');
  }

  /** The client sends the start of its local day; without it "today" is the last 24 hours. */
  private parseSince(since?: string): string {
    if (since === undefined) return new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
    const parsed = new Date(since);
    if (Number.isNaN(parsed.getTime())) throw new BadRequestException('Invalid date.');
    return parsed.toISOString();
  }
}
