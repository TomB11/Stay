import { DAILY_MISSIONS } from './constants/daily-missions.constant';
import { pickDailyMission, startOfLocalDay } from './daily-mission';

describe('daily mission', () => {
  it('stays the same during one day', () => {
    const morning = new Date(2026, 5, 10, 7, 0);
    const evening = new Date(2026, 5, 10, 22, 30);
    expect(pickDailyMission(morning)).toBe(pickDailyMission(evening));
  });

  it('rotates through all missions on consecutive days', () => {
    const picked = new Set(
      DAILY_MISSIONS.map((_, day) => pickDailyMission(new Date(2026, 5, 10 + day))),
    );
    expect(picked.size).toBe(DAILY_MISSIONS.length);
  });

  it('returns the local midnight', () => {
    const start = startOfLocalDay(new Date(2026, 5, 10, 15, 45));
    expect([start.getHours(), start.getMinutes(), start.getDate()]).toEqual([0, 0, 10]);
  });
});
