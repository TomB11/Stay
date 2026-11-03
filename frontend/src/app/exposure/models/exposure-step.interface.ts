export interface ExposureAttempt {
  id: string;
  anxietyBefore: number;
  anxietyAfter: number;
  createdAt: string;
}

export interface ExposureStep {
  id: string;
  title: string;
  expectedAnxiety: number;
  createdAt: string;
  attempts: ExposureAttempt[];
}

export type ExposureStepStatus = 'mastered' | 'next' | 'waiting';
