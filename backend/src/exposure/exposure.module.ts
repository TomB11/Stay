import { Module } from '@nestjs/common';
import { AuthModule } from '../auth/auth.module.js';
import { ExposureController } from './exposure.controller.js';
import { ExposureService } from './exposure.service.js';

@Module({
  imports: [AuthModule],
  controllers: [ExposureController],
  providers: [ExposureService],
})
export class ExposureModule {}
