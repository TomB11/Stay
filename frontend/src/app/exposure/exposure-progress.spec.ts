import { ExposureStep } from './models/exposure-step.interface';
import { isMastered, stepStatuses } from './exposure-progress';

const step = (id: string, afters: number[]): ExposureStep => ({
  id,
  title: id,
  expectedAnxiety: 3,
  createdAt: '2026-01-01T00:00:00.000Z',
  attempts: afters.map((anxietyAfter, index) => ({
    id: `${id}-${index}`,
    anxietyBefore: 8,
    anxietyAfter,
    createdAt: '2026-01-01T00:00:00.000Z',
  })),
});

describe('exposure progress', () => {
  it('treats a step without attempts as not mastered', () => {
    expect(isMastered(step('a', []))).toBe(false);
  });

  it('uses the latest attempt to decide mastery', () => {
    expect(isMastered(step('a', [2, 8]))).toBe(true);
    expect(isMastered(step('a', [8, 2]))).toBe(false);
  });

  it('marks the easiest unmastered step as next', () => {
    const statuses = stepStatuses([step('a', [1]), step('b', [6]), step('c', [])]);
    expect(statuses.get('a')).toBe('mastered');
    expect(statuses.get('b')).toBe('next');
    expect(statuses.get('c')).toBe('waiting');
  });
});
