import type { SessionFeedback, SessionPhase } from '../../sessions/models/session-record.interface.js';

export type HelpReason = 'high' | 'rising';

export interface PhaseReduction {
  phase: SessionPhase;
  count: number;
  averageReduction: number;
}

export interface Insights {
  totalRecords: number;
  averageIntensity: { last7Days: number | null; previous7Days: number | null };
  sessionReduction: { count: number; average: number | null };
  reductionByPhase: PhaseReduction[];
  diaryReduction: { count: number; average: number | null };
  helpfulRate: number | null;
  exposure: { totalSteps: number; masteredSteps: number };
  streakDays: number;
  suggestProfessionalHelp: HelpReason | null;
}

export interface InsightsSession {
  phase: SessionPhase;
  initialIntensity: number;
  finalIntensity: number;
  feedback: SessionFeedback;
  createdAt: string;
}

export interface InsightsDiaryEntry {
  intensityBefore: number;
  intensityAfter: number;
  createdAt: string;
}

export interface InsightsInput {
  sessions: InsightsSession[];
  diaryEntries: InsightsDiaryEntry[];
  exposureAttemptDates: string[];
  exposure: { totalSteps: number; masteredSteps: number };
}
