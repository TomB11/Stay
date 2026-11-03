import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { DiaryController } from './diary.controller.js';
import { DiaryService } from './diary.service.js';

@Module({
  imports: [AuthModule],
  controllers: [DiaryController],
  providers: [DiaryService],
})
export class DiaryModule {}
