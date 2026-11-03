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
import { CreateExposureAttemptDto } from './dto/create-exposure-attempt.dto.js';
import { CreateExposureStepDto } from './dto/create-exposure-step.dto.js';
import { ExposureService } from './exposure.service.js';
import type { ExposureAttempt, ExposureStep } from './models/exposure-step.interface.js';

@Controller('exposure')
@UseGuards(AuthGuard)
export class ExposureController {
  constructor(private readonly exposureService: ExposureService) {}

  @Get()
  findAll(@CurrentUserId() userId: string): Promise<ExposureStep[]> {
    return this.exposureService.findAll(userId);
  }

  @Post()
  createStep(
    @CurrentUserId() userId: string,
    @Body() input: CreateExposureStepDto,
  ): Promise<ExposureStep> {
    return this.exposureService.createStep(userId, input);
  }

  @Post(':id/attempts')
  addAttempt(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) stepId: string,
    @Body() input: CreateExposureAttemptDto,
  ): Promise<ExposureAttempt> {
    return this.exposureService.addAttempt(userId, stepId, input);
  }

  @Delete(':id')
  @HttpCode(204)
  removeStep(
    @CurrentUserId() userId: string,
    @Param('id', ParseUUIDPipe) stepId: string,
  ): Promise<void> {
    return this.exposureService.removeStep(userId, stepId);
  }
}
