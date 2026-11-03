import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { MAX_STEPS_PER_USER } from './constants/exposure-limits.constant.js';
import { CreateExposureAttemptDto } from './dto/create-exposure-attempt.dto.js';
import { CreateExposureStepDto } from './dto/create-exposure-step.dto.js';
import type { ExposureAttempt, ExposureStep } from './models/exposure-step.interface.js';

interface AttemptRow extends ExposureAttempt {
  stepId: string;
}

@Injectable()
export class ExposureService {
  constructor(private readonly database: DatabaseService) {}

  /** Returns the ladder ordered from the easiest to the hardest step. */
  async findAll(userId: string): Promise<ExposureStep[]> {
    const steps = await this.database.query<Omit<ExposureStep, 'attempts'>>(
      `SELECT id, title, expected_anxiety AS "expectedAnxiety", created_at AS "createdAt"
       FROM exposure_steps WHERE user_id = $1
       ORDER BY expected_anxiety ASC, created_at ASC`,
      [userId],
    );
    const attempts = await this.database.query<AttemptRow>(
      `SELECT id, step_id AS "stepId", anxiety_before AS "anxietyBefore",
        anxiety_after AS "anxietyAfter", created_at AS "createdAt"
       FROM exposure_attempts WHERE user_id = $1
       ORDER BY created_at DESC`,
      [userId],
    );
    return steps.map((step) => ({
      ...step,
      attempts: attempts
        .filter((attempt) => attempt.stepId === step.id)
        .map(({ stepId: _stepId, ...attempt }) => attempt),
    }));
  }

  async createStep(userId: string, input: CreateExposureStepDto): Promise<ExposureStep> {
    const [{ count }] = await this.database.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM exposure_steps WHERE user_id = $1',
      [userId],
    );
    if (Number(count) >= MAX_STEPS_PER_USER) {
      throw new BadRequestException('The ladder is full.');
    }
    const step: ExposureStep = {
      id: crypto.randomUUID(),
      title: input.title.trim(),
      expectedAnxiety: input.expectedAnxiety,
      createdAt: new Date().toISOString(),
      attempts: [],
    };
    await this.database.query(
      `INSERT INTO exposure_steps (id, user_id, title, expected_anxiety, created_at)
       VALUES ($1, $2, $3, $4, $5)`,
      [step.id, userId, step.title, step.expectedAnxiety, step.createdAt],
    );
    return step;
  }

  async addAttempt(
    userId: string,
    stepId: string,
    input: CreateExposureAttemptDto,
  ): Promise<ExposureAttempt> {
    await this.assertOwnsStep(userId, stepId);
    const attempt: ExposureAttempt = {
      id: crypto.randomUUID(),
      anxietyBefore: input.anxietyBefore,
      anxietyAfter: input.anxietyAfter,
      createdAt: new Date().toISOString(),
    };
    await this.database.query(
      `INSERT INTO exposure_attempts
        (id, step_id, user_id, anxiety_before, anxiety_after, created_at)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [attempt.id, stepId, userId, attempt.anxietyBefore, attempt.anxietyAfter, attempt.createdAt],
    );
    return attempt;
  }

  async removeStep(userId: string, stepId: string): Promise<void> {
    await this.assertOwnsStep(userId, stepId);
    await this.database.query('DELETE FROM exposure_steps WHERE id = $1 AND user_id = $2', [
      stepId,
      userId,
    ]);
  }

  private async assertOwnsStep(userId: string, stepId: string): Promise<void> {
    const rows = await this.database.query(
      'SELECT id FROM exposure_steps WHERE id = $1 AND user_id = $2',
      [stepId, userId],
    );
    if (!rows.length) throw new NotFoundException('Step not found.');
  }
}
