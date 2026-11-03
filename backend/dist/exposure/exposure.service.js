var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { MAX_STEPS_PER_USER } from './constants/exposure-limits.constant.js';
let ExposureService = class ExposureService {
    database;
    constructor(database) {
        this.database = database;
    }
    async findAll(userId) {
        const steps = await this.database.query(`SELECT id, title, expected_anxiety AS "expectedAnxiety", created_at AS "createdAt"
       FROM exposure_steps WHERE user_id = $1
       ORDER BY expected_anxiety ASC, created_at ASC`, [userId]);
        const attempts = await this.database.query(`SELECT id, step_id AS "stepId", anxiety_before AS "anxietyBefore",
        anxiety_after AS "anxietyAfter", created_at AS "createdAt"
       FROM exposure_attempts WHERE user_id = $1
       ORDER BY created_at DESC`, [userId]);
        return steps.map((step) => ({
            ...step,
            attempts: attempts
                .filter((attempt) => attempt.stepId === step.id)
                .map(({ stepId: _stepId, ...attempt }) => attempt),
        }));
    }
    async createStep(userId, input) {
        const [{ count }] = await this.database.query('SELECT COUNT(*) AS count FROM exposure_steps WHERE user_id = $1', [userId]);
        if (Number(count) >= MAX_STEPS_PER_USER) {
            throw new BadRequestException('The ladder is full.');
        }
        const step = {
            id: crypto.randomUUID(),
            title: input.title.trim(),
            expectedAnxiety: input.expectedAnxiety,
            createdAt: new Date().toISOString(),
            attempts: [],
        };
        await this.database.query(`INSERT INTO exposure_steps (id, user_id, title, expected_anxiety, created_at)
       VALUES ($1, $2, $3, $4, $5)`, [step.id, userId, step.title, step.expectedAnxiety, step.createdAt]);
        return step;
    }
    async addAttempt(userId, stepId, input) {
        await this.assertOwnsStep(userId, stepId);
        const attempt = {
            id: crypto.randomUUID(),
            anxietyBefore: input.anxietyBefore,
            anxietyAfter: input.anxietyAfter,
            createdAt: new Date().toISOString(),
        };
        await this.database.query(`INSERT INTO exposure_attempts
        (id, step_id, user_id, anxiety_before, anxiety_after, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`, [attempt.id, stepId, userId, attempt.anxietyBefore, attempt.anxietyAfter, attempt.createdAt]);
        return attempt;
    }
    async removeStep(userId, stepId) {
        await this.assertOwnsStep(userId, stepId);
        await this.database.query('DELETE FROM exposure_steps WHERE id = $1 AND user_id = $2', [
            stepId,
            userId,
        ]);
    }
    async assertOwnsStep(userId, stepId) {
        const rows = await this.database.query('SELECT id FROM exposure_steps WHERE id = $1 AND user_id = $2', [stepId, userId]);
        if (!rows.length)
            throw new NotFoundException('Step not found.');
    }
};
ExposureService = __decorate([
    Injectable(),
    __metadata("design:paramtypes", [DatabaseService])
], ExposureService);
export { ExposureService };
//# sourceMappingURL=exposure.service.js.map