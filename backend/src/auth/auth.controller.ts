import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  Post,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { RefreshTokenDto } from './dto/refresh-token.dto.js';
import type { AccountExport } from './models/account-export.interface.js';
import type { AuthResponse } from './models/auth-user.interface.js';
import { AUTH_THROTTLE } from './constants/auth-limits.constant.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { CurrentUserId } from './current-user-id.decorator.js';

@Controller('auth')
@Throttle({ default: AUTH_THROTTLE })
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  register(@Body() credentials: RegisterDto): Promise<AuthResponse> {
    return this.authService.register(credentials);
  }

  @Post('login')
  login(@Body() credentials: AuthCredentialsDto): Promise<AuthResponse> {
    return this.authService.login(credentials);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() body: RefreshTokenDto): Promise<AuthResponse> {
    return this.authService.refresh(body.refreshToken);
  }

  @Post('logout')
  @HttpCode(204)
  logout(@Body() body: RefreshTokenDto): Promise<void> {
    return this.authService.revokeRefreshToken(body.refreshToken);
  }

  @Get('export')
  @UseGuards(AuthGuard)
  exportAccount(@CurrentUserId() userId: string): Promise<AccountExport> {
    return this.authService.exportAccount(userId);
  }

  @Delete('account')
  @HttpCode(204)
  @UseGuards(AuthGuard)
  deleteAccount(@CurrentUserId() userId: string): Promise<void> {
    return this.authService.deleteAccount(userId);
  }
}
