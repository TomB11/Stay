import { IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_REWARD_TITLE_LENGTH } from '../constants/rewards-limits.constant.js';

export class CreateRewardDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_REWARD_TITLE_LENGTH)
  title!: string;
}
