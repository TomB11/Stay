import type { SessionFeedback, SessionPhase } from '../models/session-record.interface.js';
export declare class CreateSessionDto {
    phase: SessionPhase;
    situation: string;
    initialIntensity: number;
    finalIntensity: number;
    feedback: SessionFeedback;
}
