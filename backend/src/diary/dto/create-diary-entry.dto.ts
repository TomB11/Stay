import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import {
  MAX_DIARY_TEXT_LENGTH,
  MAX_EMOTION_LENGTH,
  MAX_INTENSITY,
  MIN_INTENSITY,
} from '../constants/diary-limits.constant.js';

export class CreateDiaryEntryDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_DIARY_TEXT_LENGTH)
  situation!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_DIARY_TEXT_LENGTH)
  thought!: string;

  @IsString()
  @MinLength(1)
  @MaxLength(MAX_EMOTION_LENGTH)
  emotion!: string;

  @IsInt()
  @Min(MIN_INTENSITY)
  @Max(MAX_INTENSITY)
  intensityBefore!: number;

  @IsString()
  @MaxLength(MAX_DIARY_TEXT_LENGTH)
  alternativeThought!: string;

  @IsInt()
  @Min(MIN_INTENSITY)
  @Max(MAX_INTENSITY)
  intensityAfter!: number;
}
