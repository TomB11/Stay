import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';
import {
  MAX_EMAIL_LENGTH,
  MAX_PASSWORD_LENGTH,
  MIN_PASSWORD_LENGTH,
} from '../constants/auth-limits.constant.js';

export class AuthCredentialsDto {
  @IsEmail()
  @MaxLength(MAX_EMAIL_LENGTH)
  email!: string;

  @IsString()
  @MinLength(MIN_PASSWORD_LENGTH)
  @MaxLength(MAX_PASSWORD_LENGTH)
  password!: string;
}
