import { IsString, MaxLength, MinLength } from 'class-validator';
import { MAX_REFRESH_TOKEN_LENGTH } from '../constants/auth-limits.constant.js';

export class RefreshTokenDto {
  @IsString()
  @MinLength(1)
  @MaxLength(MAX_REFRESH_TOKEN_LENGTH)
  refreshToken!: string;
}
