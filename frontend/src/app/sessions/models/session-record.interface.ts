import { SessionFeedback } from './session-feedback.type';
import { SessionPhase } from './session-phase.type';

export interface SessionRecord {
  id: string;
  phase: SessionPhase;
  situation: string;
  initialIntensity: number;
  finalIntensity: number;
  feedback: SessionFeedback;
  createdAt: string;
}
