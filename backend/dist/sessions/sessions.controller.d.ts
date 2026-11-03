import { CreateSessionDto } from './dto/create-session.dto.js';
import type { SessionRecord } from './models/session-record.interface.js';
import { SessionsService } from './sessions.service.js';
export declare class SessionsController {
    private readonly sessionsService;
    constructor(sessionsService: SessionsService);
    create(userId: string, input: CreateSessionDto): Promise<SessionRecord>;
    findAll(userId: string): Promise<SessionRecord[]>;
}
