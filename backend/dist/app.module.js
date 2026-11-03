var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
import { Module, ValidationPipe } from '@nestjs/common';
import { APP_GUARD, APP_PIPE } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { SessionsModule } from './sessions/sessions.module.js';
import { AuthModule } from './auth/auth.module.js';
import { DEFAULT_THROTTLE } from './auth/constants/auth-limits.constant.js';
import { DatabaseModule } from './database/database.module.js';
let AppModule = class AppModule {
};
AppModule = __decorate([
    Module({
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
], AppModule);
export { AppModule };
//# sourceMappingURL=app.module.js.map