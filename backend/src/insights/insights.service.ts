import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { MASTERED_ANXIETY } from './constants/insights.constant.js';
import { calculateInsights } from './insights-calculator.js';
import type {
  Insights,
  InsightsDiaryEntry,
  InsightsSession,
} from './models/insights.interface.js';

@Injectable()
export class InsightsService {
  constructor(private readonly database: DatabaseService) {}

  async getInsights(userId: string): Promise<Insights> {
    const sessions = await this.database.query<InsightsSession>(
      `SELECT phase, initial_intensity AS "initialIntensity",
        final_intensity AS "finalIntensity", feedback, created_at AS "createdAt"
       FROM sessions WHERE user_id = $1`,
      [userId],
    );
    const diaryEntries = await this.database.query<InsightsDiaryEntry>(
      `SELECT intensity_before AS "intensityBefore", intensity_after AS "intensityAfter",
        created_at AS "createdAt"
       FROM diary_entries WHERE user_id = $1`,
      [userId],
    );
    const attempts = await this.database.query<{ createdAt: string }>(
      'SELECT created_at AS "createdAt" FROM exposure_attempts WHERE user_id = $1',
      [userId],
    );
    const [exposure] = await this.database.query<{ totalSteps: number; masteredSteps: number }>(
      `SELECT COUNT(*)::int AS "totalSteps",
        COUNT(*) FILTER (WHERE (
          SELECT a.anxiety_after FROM exposure_attempts a
          WHERE a.step_id = s.id ORDER BY a.created_at DESC LIMIT 1
        ) <= $2)::int AS "masteredSteps"
       FROM exposure_steps s WHERE s.user_id = $1`,
      [userId, MASTERED_ANXIETY],
    );
    return calculateInsights({
      sessions,
      diaryEntries,
      exposureAttemptDates: attempts.map((attempt) => attempt.createdAt),
      exposure,
    });
  }
}
