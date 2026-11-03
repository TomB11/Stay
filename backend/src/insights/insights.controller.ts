import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUserId } from '../auth/current-user-id.decorator.js';
import { InsightsService } from './insights.service.js';
import type { Insights } from './models/insights.interface.js';

@Controller('insights')
@UseGuards(AuthGuard)
export class InsightsController {
  constructor(private readonly insightsService: InsightsService) {}

  @Get()
  getInsights(@CurrentUserId() userId: string): Promise<Insights> {
    return this.insightsService.getInsights(userId);
  }
}
