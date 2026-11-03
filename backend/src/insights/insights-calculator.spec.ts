import { calculateInsights } from './insights-calculator.js';
import type { InsightsInput } from './models/insights.interface.js';

const NOW = new Date('2026-03-20T12:00:00.000Z');
const daysAgo = (days: number) => new Date(NOW.getTime() - days * 86_400_000).toISOString();
const session = (days: number, initial: number, final: number, phase: 'before' | 'now' = 'now') => ({
  phase,
  initialIntensity: initial,
  finalIntensity: final,
  feedback: 'yes' as const,
  createdAt: daysAgo(days),
});
const input = (overrides: Partial<InsightsInput> = {}): InsightsInput => ({
  sessions: [],
  diaryEntries: [],
  exposureAttemptDates: [],
  exposure: { totalSteps: 0, masteredSteps: 0 },
  ...overrides,
});

describe('calculateInsights', () => {
  it('returns empty values without data', () => {
    const insights = calculateInsights(input(), NOW);
    expect(insights.totalRecords).toBe(0);
    expect(insights.averageIntensity).toEqual({ last7Days: null, previous7Days: null });
    expect(insights.helpfulRate).toBeNull();
    expect(insights.streakDays).toBe(0);
    expect(insights.suggestProfessionalHelp).toBeNull();
  });

  it('does not report a trend from fewer than three readings', () => {
    const insights = calculateInsights(input({ sessions: [session(1, 8, 4), session(2, 8, 4)] }), NOW);
    expect(insights.averageIntensity.last7Days).toBeNull();
  });

  it('compares the last 7 days with the previous 7 days', () => {
    const sessions = [
      session(1, 4, 2), session(2, 4, 2), session(3, 4, 2),
      session(8, 8, 5), session(9, 8, 5), session(10, 8, 5),
    ];
    const insights = calculateInsights(input({ sessions }), NOW);
    expect(insights.averageIntensity).toEqual({ last7Days: 4, previous7Days: 8 });
    expect(insights.sessionReduction).toEqual({ count: 6, average: 2.5 });
  });

  it('averages the reduction per phase and for the diary', () => {
    const insights = calculateInsights(
      input({
        sessions: [session(1, 6, 2, 'before'), session(2, 6, 4, 'now')],
        diaryEntries: [{ intensityBefore: 8, intensityAfter: 5, createdAt: daysAgo(1) }],
      }),
      NOW,
    );
    expect(insights.reductionByPhase).toEqual([
      { phase: 'before', count: 1, averageReduction: 4 },
      { phase: 'now', count: 1, averageReduction: 2 },
    ]);
    expect(insights.diaryReduction).toEqual({ count: 1, average: 3 });
  });

  it('computes the helpful rate and streak', () => {
    const sessions = [
      session(0, 5, 3),
      session(1, 5, 3),
      { ...session(2, 5, 5), feedback: 'no' as const },
      session(4, 5, 3),
    ];
    const insights = calculateInsights(input({ sessions }), NOW);
    expect(insights.helpfulRate).toBe(75);
    expect(insights.streakDays).toBe(3);
  });

  it('keeps the streak alive when the last activity was yesterday', () => {
    const insights = calculateInsights(input({ sessions: [session(1, 5, 3)] }), NOW);
    expect(insights.streakDays).toBe(1);
  });

  it('suggests professional help when anxiety stays high', () => {
    const sessions = [1, 2, 3, 5, 6].map((d) => session(d, 8, 7));
    expect(calculateInsights(input({ sessions }), NOW).suggestProfessionalHelp).toBe('high');
  });

  it('suggests professional help when anxiety rises to a high level', () => {
    const sessions = [
      session(1, 6, 5), session(2, 7, 5), session(3, 6, 5),
      session(8, 3, 2), session(9, 3, 2), session(10, 3, 2),
    ];
    expect(calculateInsights(input({ sessions }), NOW).suggestProfessionalHelp).toBe('rising');
  });

  it('does not suggest help for low or falling anxiety', () => {
    const sessions = [1, 2, 3, 8, 9, 10].map((d) => session(d, 3, 1));
    expect(calculateInsights(input({ sessions }), NOW).suggestProfessionalHelp).toBeNull();
  });
});
