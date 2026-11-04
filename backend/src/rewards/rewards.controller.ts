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
import { CreateRewardDto } from './dto/create-reward.dto.js';
import type { OpenedReward, RewardsOverview, RewardView } from './models/rewards.interface.js';
import { RewardsService } from './rewards.service.js';

@Controller('rewards')
@UseGuards(AuthGuard)
export class RewardsController {
  constructor(private readonly rewardsService: RewardsService) {}

  @Get()
  overview(@CurrentUserId() userId: string): Promise<RewardsOverview> {
    return this.rewardsService.getOverview(userId);
  }

  @Post()
  create(
    @CurrentUserId() userId: string,
    @Body() input: CreateRewardDto,
  ): Promise<RewardView> {
    return this.rewardsService.create(userId, input);
  }

  @Post('open')
  @HttpCode(200)
  open(@CurrentUserId() userId: string): Promise<OpenedReward> {
    return this.rewardsService.open(userId);
  }

  @Post(':id/redeem')
  @HttpCode(204)
  redeem(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) rewardId: string,
  ): Promise<void> {
    return this.rewardsService.redeem(userId, rewardId);
  }

  @Delete(':id')
  @HttpCode(204)
  remove(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) rewardId: string,
  ): Promise<void> {
    return this.rewardsService.remove(userId, rewardId);
  }
}
