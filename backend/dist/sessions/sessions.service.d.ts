import { CreateSessionDto } from './dto/create-session.dto.js';
import { SessionRecord } from './models/session-record.interface.js';
import { DatabaseService } from '../database/database.service.js';
export declare class SessionsService {
    private readonly database;
    constructor(database: DatabaseService);
    create(userId: string, input: CreateSessionDto): Promise<SessionRecord>;
    findAll(userId: string): Promise<SessionRecord[]>;
}
