import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DEFAULT_THROTTLE } from './auth/constants/auth-limits.constant.js';
import { DatabaseModule } from './database/database.module.js';

@Module({
  imports: [
    ThrottlerModule.forRoot([DEFAULT_THROTTLE]),
    DatabaseModule,
    AuthModule,
    SessionsModule,
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
