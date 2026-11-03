import { IsInt, Max, Min } from 'class-validator';
import { MAX_ANXIETY, MIN_ANXIETY } from '../constants/exposure-limits.constant.js';

export class CreateExposureAttemptDto {
  @IsInt()
  @Min(MIN_ANXIETY)
  @Max(MAX_ANXIETY)
  anxietyBefore!: number;

  @IsInt()
  @Min(MIN_ANXIETY)
  @Max(MAX_ANXIETY)
  anxietyAfter!: number;
}
