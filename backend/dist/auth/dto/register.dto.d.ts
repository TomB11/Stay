import { AuthCredentialsDto } from './auth-credentials.dto.js';
export declare class RegisterDto extends AuthCredentialsDto {
    consentAccepted: boolean;
    ageConfirmed: boolean;
}
