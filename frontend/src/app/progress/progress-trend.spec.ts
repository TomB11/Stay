import { trendDirection } from './progress-trend';

describe('trendDirection', () => {
  it('is unknown without enough data', () => {
    expect(trendDirection({ last7Days: 4, previous7Days: null })).toBe('unknown');
  });

  it('detects falling, rising and stable averages', () => {
    expect(trendDirection({ last7Days: 4, previous7Days: 6 })).toBe('down');
    expect(trendDirection({ last7Days: 6, previous7Days: 4 })).toBe('up');
    expect(trendDirection({ last7Days: 5, previous7Days: 5.3 })).toBe('stable');
  });
});
