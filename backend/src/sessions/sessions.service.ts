import { Injectable } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { SessionRecord } from './models/session-record.interface.js';
import { DatabaseService } from '../database/database.service.js';

@Injectable()
export class SessionsService {
  constructor(private readonly database: DatabaseService) {}

  /** Stores a completed session for the account. */
  async create(userId: string, input: CreateSessionDto): Promise<SessionRecord> {
    const session: SessionRecord = {
      userId,
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    await this.database.query(
      `INSERT INTO sessions
        (id, user_id, phase, situation, initial_intensity, final_intensity, feedback, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
      [
        session.id,
        session.userId,
        session.phase,
        session.situation,
        session.initialIntensity,
        session.finalIntensity,
        session.feedback,
        session.createdAt,
      ],
    );
    return session;
  }

  /** Returns newest sessions first for the history page. */
  findAll(userId: string): Promise<SessionRecord[]> {
    return this.database.query<SessionRecord>(
      `SELECT
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
       ORDER BY created_at DESC`,
      [userId],
    );
  }
}