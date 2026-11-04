export interface AccountExport {
  exportedAt: string;
  account: { id: string; email: string; consentAt: string | null };
  sessions: {
    id: string;
    phase: string;
    situation: string;
    initialIntensity: number;
    finalIntensity: number;
    feedback: string;
    createdAt: string;
  }[];
  exposureSteps: {
    id: string;
    title: string;
    expectedAnxiety: number;
    createdAt: string;
  }[];
  diaryEntries: {
    id: string;
    situation: string;
    thought: string;
    emotion: string;
    intensityBefore: number;
    alternativeThought: string;
    intensityAfter: number;
    createdAt: string;
  }[];
  rewards: {
    id: string;
    title: string;
    createdAt: string;
    openedAt: string | null;
    redeemedAt: string | null;
  }[];
  exposureAttempts: {
    id: string;
    stepId: string;
    anxietyBefore: number;
    anxietyAfter: number;
    createdAt: string;
  }[];
}
