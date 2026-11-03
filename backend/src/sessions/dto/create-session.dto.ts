import { IsIn, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import {
  MAX_INTENSITY,
  MAX_SITUATION_LENGTH,
  MIN_INTENSITY,
  SESSION_FEEDBACKS,
  SESSION_PHASES,
} from '../constants/session-limits.constant.js';
import type {
  SessionFeedback,
  SessionPhase,
} from '../models/session-record.interface.js';

export class CreateSessionDto {
  @IsIn(SESSION_PHASES)
  phase!: SessionPhase;

  @IsString()
  @MaxLength(MAX_SITUATION_LENGTH)
  situation!: string;

  @IsInt()
  @Min(MIN_INTENSITY)
  @Max(MAX_INTENSITY)
  initialIntensity!: number;

  @IsInt()
  @Min(MIN_INTENSITY)
  @Max(MAX_INTENSITY)
  finalIntensity!: number;

  @IsIn(SESSION_FEEDBACKS)
  feedback!: SessionFeedback;
}
