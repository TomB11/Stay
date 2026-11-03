var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
let SessionsService = class SessionsService {
    database;
    constructor(database) {
        this.database = database;
    }
    async create(userId, input) {
        const session = {
            userId,
            ...input,
            id: crypto.randomUUID(),
            createdAt: new Date().toISOString(),
        };
        await this.database.query(`INSERT INTO sessions
        (id, user_id, phase, situation, initial_intensity, final_intensity, feedback, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`, [
            session.id,
            session.userId,
            session.phase,
            session.situation,
            session.initialIntensity,
            session.finalIntensity,
            session.feedback,
            session.createdAt,
        ]);
        return session;
    }
    findAll(userId) {
        return this.database.query(`SELECT
        user_id AS "userId",
        id,
        phase,
        situation,
        initial_intensity AS "initialIntensity",
        final_intensity AS "finalIntensity",
        feedback,
        created_at AS "createdAt"
       FROM sessions
       WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
    }
};
SessionsService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], SessionsService);
export { SessionsService };
//# sourceMappingURL=sessions.service.js.map