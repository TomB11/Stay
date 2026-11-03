import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Param,
  ParseUUIDPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUserId } from '../auth/current-user-id.decorator.js';
import { DiaryService } from './diary.service.js';
import { CreateDiaryEntryDto } from './dto/create-diary-entry.dto.js';
import type { DiaryEntry } from './models/diary-entry.interface.js';

@Controller('diary')
@UseGuards(AuthGuard)
export class DiaryController {
  constructor(private readonly diaryService: DiaryService) {}

  @Get()
  findAll(@CurrentUserId() userId: string): Promise<DiaryEntry[]> {
    return this.diaryService.findAll(userId);
  }

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Body() input: CreateDiaryEntryDto,
  ): Promise<DiaryEntry> {
    return this.diaryService.create(userId, input);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) entryId: string,
  ): Promise<void> {
    return this.diaryService.remove(userId, entryId);
  }
}
