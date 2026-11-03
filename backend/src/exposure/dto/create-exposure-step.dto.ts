import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import {
  MAX_ANXIETY,
  MAX_STEP_TITLE_LENGTH,
  MIN_ANXIETY,
} from '../constants/exposure-limits.constant.js';

export class CreateExposureStepDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_STEP_TITLE_LENGTH)
  title!: string;

  @IsInt()
  @Min(MIN_ANXIETY)
  @Max(MAX_ANXIETY)
  expectedAnxiety!: number;
}
