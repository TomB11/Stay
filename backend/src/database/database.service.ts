import { Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import type { PGlite } from '@electric-sql/pglite';
import pg from 'pg';
import { DATABASE_SCHEMA } from './database-schema.constant.js';

/** Postgres access: Neon via `pg` in runtime, in-process PGlite when NODE_ENV is "test". */
@Injectable()
export class DatabaseService implements OnModuleInit, OnModuleDestroy {
  private pool?: pg.Pool;
  private memory?: PGlite;

  async onModuleInit(): Promise<void> {
    if (process.env.NODE_ENV === 'test') {
      const { PGlite } = await import('@electric-sql/pglite');
      this.memory = new PGlite();
    } else {
      const connectionString = process.env.DATABASE_URL;
      if (!connectionString) {
        throw new Error('DATABASE_URL is not set.');
      }
      this.pool = new pg.Pool({ connectionString, max: 5 });
    }
    await this.query(DATABASE_SCHEMA);
  }

  /** Runs a parameterised query and returns its rows. */
  async query<T = Record<string, unknown>>(
    text: string,
    params: unknown[] = [],
  ): Promise<T[]> {
    if (this.memory) {
      // PGlite rejects multi-statement text when parameters are passed.
      const result = params.length
        ? await this.memory.query<T>(text, params)
        : { rows: (await this.memory.exec(text)).flatMap((r) => r.rows as T[]) };
      return result.rows;
    }
    return (await this.pool!.query(text, params)).rows as T[];
  }

  async onModuleDestroy(): Promise<void> {
    await this.pool?.end();
    await this.memory?.close();
  }
}