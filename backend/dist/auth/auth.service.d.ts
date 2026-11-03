import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AccountExport } from './models/account-export.interface.js';
import { AuthResponse } from './models/auth-user.interface.js';
import { DatabaseService } from '../database/database.service.js';
export declare class AuthService {
    private readonly database;
    constructor(database: DatabaseService);
    register(credentials: RegisterDto): Promise<AuthResponse>;
    deleteAccount(userId: string): Promise<void>;
    exportAccount(userId: string): Promise<AccountExport>;
    login(credentials: AuthCredentialsDto): Promise<AuthResponse>;
    userIdFromToken(token: string | undefined): Promise<string>;
    private createResponse;
    private hashToken;
    private normalizeEmail;
    private hashPassword;
    private verifyPassword;
}
