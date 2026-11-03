import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUserId } from '../auth/current-user-id.decorator.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import type { SessionRecord } from './models/session-record.interface.js';
import { SessionsService } from './sessions.service.js';

@Controller('sessions')
@UseGuards(AuthGuard)
export class SessionsController {
  constructor(private readonly sessionsService: SessionsService) {}

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Body() input: CreateSessionDto,
  ): Promise<SessionRecord> {
    return this.sessionsService.create(userId, input);
  }

  @Get()
  findAll(@CurrentUserId() userId: string): Promise<SessionRecord[]> {
    return this.sessionsService.findAll(userId);
  }
}
