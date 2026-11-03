export type SessionPhase = 'before' | 'now' | 'after' | 'unsure';
export type SessionFeedback = 'yes' | 'a-little' | 'no';
export interface SessionRecord {
    userId: string;
    id: string;
    phase: SessionPhase;
    situation: string;
    initialIntensity: number;
    finalIntensity: number;
    feedback: SessionFeedback;
    createdAt: string;
}
