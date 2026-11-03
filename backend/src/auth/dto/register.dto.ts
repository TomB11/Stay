import { Equals } from 'class-validator';
import { AuthCredentialsDto } from './auth-credentials.dto.js';

export class RegisterDto extends AuthCredentialsDto {
  /** Explicit consent to processing of health-related data (GDPR Art. 9). */
  @Equals(true)
  consentAccepted!: boolean;

  /** Confirms the user is at least MIN_REGISTRATION_AGE years old. */
  @Equals(true)
  ageConfirmed!: boolean;
}
