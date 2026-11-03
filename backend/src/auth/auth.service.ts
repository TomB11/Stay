import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AccountExport } from './models/account-export.interface.js';
import { AuthResponse, AuthUser } from './models/auth-user.interface.js';
import { TOKEN_LIFETIME_MS } from './constants/auth-limits.constant.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class AuthService {
  constructor(private readonly database: DatabaseService) {}

  /** Creates an account and returns its access token. */
  async register(credentials: RegisterDto): Promise<AuthResponse> {
    const email = this.normalizeEmail(credentials.email);
    const [existingUser] = await this.database.query(
      'SELECT id FROM users WHERE email = $1',
      [email],
    );
    if (existingUser) {
      throw new BadRequestException(
        'An account with this email already exists.',
      );
    }
    const user: AuthUser = {
      id: crypto.randomUUID(),
      email,
      passwordHash: this.hashPassword(credentials.password),
    };
    await this.database.query(
      'INSERT INTO users (id, email, password_hash, consent_at) VALUES ($1, $2, $3, $4)',
      [user.id, user.email, user.passwordHash, new Date().toISOString()],
    );
    return this.createResponse(user);
  }

  /** Permanently removes the account; sessions and tokens are deleted by cascade. */
  async deleteAccount(userId: string): Promise<void> {
    await this.database.query('DELETE FROM users WHERE id = $1', [userId]);
  }

  /** Returns all personal data stored for the account (GDPR data portability). */
  async exportAccount(userId: string): Promise<AccountExport> {
    const [account] = await this.database.query<AccountExport['account']>(
      'SELECT id, email, consent_at AS "consentAt" FROM users WHERE id = $1',
      [userId],
    );
    if (!account) throw new UnauthorizedException('Authentication is required.');
    const sessions = await this.database.query<AccountExport['sessions'][number]>(
      `SELECT id, phase, situation, initial_intensity AS "initialIntensity",
        final_intensity AS "finalIntensity", feedback, created_at AS "createdAt"
       FROM sessions WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
    return { exportedAt: new Date().toISOString(), account, sessions };
  }

  /** Verifies credentials without exposing password hashes to the API. */
  async login(credentials: AuthCredentialsDto): Promise<AuthResponse> {
    const [user] = await this.database.query<AuthUser>(
      'SELECT id, email, password_hash AS "passwordHash" FROM users WHERE email = $1',
      [this.normalizeEmail(credentials.email)],
    );
    if (
      !user ||
      !this.verifyPassword(credentials.password, user.passwordHash)
    ) {
      throw new UnauthorizedException('Invalid email or password.');
    }
    return this.createResponse(user);
  }

  /** Resolves a bearer token to its account id for protected resources. */
  async userIdFromToken(token: string | undefined): Promise<string> {
    const tokenHash = token ? this.hashToken(token) : undefined;
    const [record] = tokenHash
      ? await this.database.query<{ userId: string; expiresAt: string }>(
          'SELECT user_id AS "userId", expires_at AS "expiresAt" FROM auth_tokens WHERE token_hash = $1',
          [tokenHash],
        )
      : [];
    // BIGINT columns come back from Postgres as strings.
    if (!record || Number(record.expiresAt) <= Date.now()) {
      if (tokenHash) {
        await this.database.query(
          'DELETE FROM auth_tokens WHERE token_hash = $1',
          [tokenHash],
        );
      }
      throw new UnauthorizedException('Authentication is required.');
    }
    return record.userId;
  }

  /** Creates an access token, stores only its hash and removes sensitive fields from the response. */
  private async createResponse(user: AuthUser): Promise<AuthResponse> {
    const token = randomBytes(32).toString('hex');
    const now = Date.now();
    await this.database.query('DELETE FROM auth_tokens WHERE expires_at <= $1', [
      now,
    ]);
    await this.database.query(
      'INSERT INTO auth_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)',
      [this.hashToken(token), user.id, now + TOKEN_LIFETIME_MS],
    );
    return { token, user: { id: user.id, email: user.email } };
  }
  /** Tokens are high-entropy random values, so a fast hash is sufficient for storage. */
  private hashToken(token: string): string {
    return createHash('sha256').update(token).digest('hex');
  }

  /** Normalizes email addresses for consistent lookup and uniqueness checks. */
  private normalizeEmail(email: string): string {
    return email.trim().toLowerCase();
  }

  /** Hashes a password with a fresh random salt before storing it. */
  private hashPassword(password: string): string {
    const salt = randomBytes(16).toString('hex');
    return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
  }

  /** Compares a plain password with its stored salted hash. */
  private verifyPassword(password: string, storedHash: string): boolean {
    const [salt, hash] = storedHash.split(':');
    if (!salt || !hash) return false;
    const expected = Buffer.from(hash, 'hex');
    const actual = scryptSync(password, salt, 64);
    return (
      expected.length === actual.length && timingSafeEqual(expected, actual)
    );
  }
}
