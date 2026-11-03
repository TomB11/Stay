import { SessionPhase } from '../../sessions/models/session-phase.type';

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
