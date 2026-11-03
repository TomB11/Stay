export interface AccountExport {
    exportedAt: string;
    account: {
        id: string;
        email: string;
        consentAt: string | null;
    };
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
    exposureAttempts: {
        id: string;
        stepId: string;
        anxietyBefore: number;
        anxietyAfter: number;
        createdAt: string;
    }[];
}
