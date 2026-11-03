import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { InsightsModule } from './insights/insights.module.js';
import { DiaryModule } from './diary/diary.module.js';
import { ExposureModule } from './exposure/exposure.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DEFAULT_THROTTLE } from './auth/constants/auth-limits.constant.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([DEFAULT_THROTTLE]),
    DatabaseModule,
    AuthModule,
    SessionsModule,
    ExposureModule,
    DiaryModule,
    InsightsModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    {
      provide: APP_PIPE,
      useValue: new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true }),
    },
  ],
})
export class AppModule {}
