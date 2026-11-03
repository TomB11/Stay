import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../database/database.service.js';
import { MAX_DIARY_ENTRIES_PER_USER } from './constants/diary-limits.constant.js';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto.js';
import type { DiaryEntry } from './models/diary-entry.interface.js';

@Injectable()
export class DiaryService {
  constructor(private readonly database: DatabaseService) {}

  /** Returns newest entries first. */
  findAll(userId: string): Promise<DiaryEntry[]> {
    return this.database.query<DiaryEntry>(
      `SELECT id, situation, thought, emotion,
        intensity_before AS "intensityBefore",
        alternative_thought AS "alternativeThought",
        intensity_after AS "intensityAfter",
        created_at AS "createdAt"
       FROM diary_entries WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId],
    );
  }

  async create(userId: string, input: CreateDiaryEntryDto): Promise<DiaryEntry> {
    const [{ count }] = await this.database.query<{ count: string }>(
      'SELECT COUNT(*) AS count FROM diary_entries WHERE user_id = $1',
      [userId],
    );
    if (Number(count) >= MAX_DIARY_ENTRIES_PER_USER) {
      throw new BadRequestException('The diary is full.');
    }
    const entry: DiaryEntry = {
      id: crypto.randomUUID(),
      situation: input.situation.trim(),
      thought: input.thought.trim(),
      emotion: input.emotion.trim(),
      intensityBefore: input.intensityBefore,
      alternativeThought: input.alternativeThought.trim(),
      intensityAfter: input.intensityAfter,
      createdAt: new Date().toISOString(),
    };
    await this.database.query(
      `INSERT INTO diary_entries
        (id, user_id, situation, thought, emotion, intensity_before,
         alternative_thought, intensity_after, created_at)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        entry.id,
        userId,
        entry.situation,
        entry.thought,
        entry.emotion,
        entry.intensityBefore,
        entry.alternativeThought,
        entry.intensityAfter,
        entry.createdAt,
      ],
    );
    return entry;
  }

  async remove(userId: string, entryId: string): Promise<void> {
    const rows = await this.database.query(
      'DELETE FROM diary_entries WHERE id = $1 AND user_id = $2 RETURNING id',
      [entryId, userId],
    );
    if (!rows.length) throw new NotFoundException('Entry not found.');
  }
}
