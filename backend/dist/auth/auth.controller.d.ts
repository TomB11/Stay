import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import type { AccountExport } from './models/account-export.interface.js';
import type { AuthResponse } from './models/auth-user.interface.js';
import { AuthService } from './auth.service.js';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(credentials: RegisterDto): Promise<AuthResponse>;
    login(credentials: AuthCredentialsDto): Promise<AuthResponse>;
    exportAccount(userId: string): Promise<AccountExport>;
    deleteAccount(userId: string): Promise<void>;
}
