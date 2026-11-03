import { MASTERED_ANXIETY } from './constants/exposure.constant';
import { ExposureStep, ExposureStepStatus } from './models/exposure-step.interface';

/** Attempts arrive newest first, so the first one is the latest. */
export function isMastered(step: ExposureStep): boolean {
  const latest = step.attempts[0];
  return latest !== undefined && latest.anxietyAfter <= MASTERED_ANXIETY;
}

/** Returns the status of every step; the easiest unmastered step is the next one. */
export function stepStatuses(steps: ExposureStep[]): Map<string, ExposureStepStatus> {
  const statuses = new Map<string, ExposureStepStatus>();
  let nextAssigned = false;
  for (const step of steps) {
    if (isMastered(step)) {
      statuses.set(step.id, 'mastered');
    } else if (!nextAssigned) {
      statuses.set(step.id, 'next');
      nextAssigned = true;
    } else {
      statuses.set(step.id, 'waiting');
    }
  }
  return statuses;
}
