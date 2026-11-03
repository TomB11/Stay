var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, UnauthorizedException, } from '@nestjs/common';
import { createHash, randomBytes, scryptSync, timingSafeEqual } from 'node:crypto';
import { TOKEN_LIFETIME_MS } from './constants/auth-limits.constant.js';
import { DatabaseService } from '../database/database.service.js';
let AuthService = class AuthService {
    database;
    constructor(database) {
        this.database = database;
    }
    async register(credentials) {
        const email = this.normalizeEmail(credentials.email);
        const [existingUser] = await this.database.query('SELECT id FROM users WHERE email = $1', [email]);
        if (existingUser) {
            throw new BadRequestException('An account with this email already exists.');
        }
        const user = {
            id: crypto.randomUUID(),
            email,
            passwordHash: this.hashPassword(credentials.password),
        };
        await this.database.query('INSERT INTO users (id, email, password_hash, consent_at) VALUES ($1, $2, $3, $4)', [user.id, user.email, user.passwordHash, new Date().toISOString()]);
        return this.createResponse(user);
    }
    async deleteAccount(userId) {
        await this.database.query('DELETE FROM users WHERE id = $1', [userId]);
    }
    async exportAccount(userId) {
        const [account] = await this.database.query('SELECT id, email, consent_at AS "consentAt" FROM users WHERE id = $1', [userId]);
        if (!account)
            throw new UnauthorizedException('Authentication is required.');
        const sessions = await this.database.query(`SELECT id, phase, situation, initial_intensity AS "initialIntensity",
        final_intensity AS "finalIntensity", feedback, created_at AS "createdAt"
       FROM sessions WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        const exposureSteps = await this.database.query(`SELECT id, title, expected_anxiety AS "expectedAnxiety", created_at AS "createdAt"
       FROM exposure_steps WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        const exposureAttempts = await this.database.query(`SELECT id, step_id AS "stepId", anxiety_before AS "anxietyBefore",
        anxiety_after AS "anxietyAfter", created_at AS "createdAt"
       FROM exposure_attempts WHERE user_id = $1 ORDER BY created_at DESC`, [userId]);
        return {
            exportedAt: new Date().toISOString(),
            account,
            sessions,
            exposureSteps,
            exposureAttempts,
        };
    }
    async login(credentials) {
        const [user] = await this.database.query('SELECT id, email, password_hash AS "passwordHash" FROM users WHERE email = $1', [this.normalizeEmail(credentials.email)]);
        if (!user ||
            !this.verifyPassword(credentials.password, user.passwordHash)) {
            throw new UnauthorizedException('Invalid email or password.');
        }
        return this.createResponse(user);
    }
    async userIdFromToken(token) {
        const tokenHash = token ? this.hashToken(token) : undefined;
        const [record] = tokenHash
            ? await this.database.query('SELECT user_id AS "userId", expires_at AS "expiresAt" FROM auth_tokens WHERE token_hash = $1', [tokenHash])
            : [];
        if (!record || Number(record.expiresAt) <= Date.now()) {
            if (tokenHash) {
                await this.database.query('DELETE FROM auth_tokens WHERE token_hash = $1', [tokenHash]);
            }
            throw new UnauthorizedException('Authentication is required.');
        }
        return record.userId;
    }
    async createResponse(user) {
        const token = randomBytes(32).toString('hex');
        const now = Date.now();
        await this.database.query('DELETE FROM auth_tokens WHERE expires_at <= $1', [
            now,
        ]);
        await this.database.query('INSERT INTO auth_tokens (token_hash, user_id, expires_at) VALUES ($1, $2, $3)', [this.hashToken(token), user.id, now + TOKEN_LIFETIME_MS]);
        return { token, user: { id: user.id, email: user.email } };
    }
    hashToken(token) {
        return createHash('sha256').update(token).digest('hex');
    }
    normalizeEmail(email) {
        return email.trim().toLowerCase();
    }
    hashPassword(password) {
        const salt = randomBytes(16).toString('hex');
        return `${salt}:${scryptSync(password, salt, 64).toString('hex')}`;
    }
    verifyPassword(password, storedHash) {
        const [salt, hash] = storedHash.split(':');
        if (!salt || !hash)
            return false;
        const expected = Buffer.from(hash, 'hex');
        const actual = scryptSync(password, salt, 64);
        return (expected.length === actual.length && timingSafeEqual(expected, actual));
    }
};
AuthService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], AuthService);
export { AuthService };
//# sourceMappingURL=auth.service.js.map