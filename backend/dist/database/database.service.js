var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Injectable } from '@nestjs/common';
import pg from 'pg';
import { DATABASE_SCHEMA } from './database-schema.constant.js';
let DatabaseService = class DatabaseService {
    pool;
    memory;
    async onModuleInit() {
        if (process.env.NODE_ENV === 'test') {
            const { PGlite } = await import('@electric-sql/pglite');
            this.memory = new PGlite();
        }
        else {
            const connectionString = process.env.DATABASE_URL;
            if (!connectionString) {
                throw new Error('DATABASE_URL is not set.');
            }
            this.pool = new pg.Pool({ connectionString, max: 5 });
        }
        await this.query(DATABASE_SCHEMA);
    }
    async query(text, params = []) {
        if (this.memory) {
            const result = params.length
                ? await this.memory.query(text, params)
                : { rows: (await this.memory.exec(text)).flatMap((r) => r.rows) };
            return result.rows;
        }
        return (await this.pool.query(text, params)).rows;
    }
    async onModuleDestroy() {
        await this.pool?.end();
        await this.memory?.close();
    }
};
DatabaseService = __decorate([
    Injectable()
], DatabaseService);
export { DatabaseService };
//# sourceMappingURL=database.service.js.map