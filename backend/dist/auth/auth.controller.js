var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
import { Body, Controller, Delete, Get, HttpCode, Post, UseGuards, } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { AuthCredentialsDto } from './dto/auth-credentials.dto.js';
import { RegisterDto } from './dto/register.dto.js';
import { AUTH_THROTTLE } from './constants/auth-limits.constant.js';
import { AuthGuard } from './auth.guard.js';
import { AuthService } from './auth.service.js';
import { CurrentUserId } from './current-user-id.decorator.js';
let AuthController = class AuthController {
    authService;
    constructor(authService) {
        this.authService = authService;
    }
    register(credentials) {
        return this.authService.register(credentials);
    }
    login(credentials) {
        return this.authService.login(credentials);
    }
    exportAccount(userId) {
        return this.authService.exportAccount(userId);
    }
    deleteAccount(userId) {
        return this.authService.deleteAccount(userId);
    }
};
__decorate([
    Post('register'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [RegisterDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "register", null);
__decorate([
    Post('login'),
    __param(0, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [AuthCredentialsDto]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "login", null);
__decorate([
    Get('export'),
    UseGuards(AuthGuard),
    __param(0, CurrentUserId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "exportAccount", null);
__decorate([
    Delete('account'),
    HttpCode(204),
    UseGuards(AuthGuard),
    __param(0, CurrentUserId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AuthController.prototype, "deleteAccount", null);
AuthController = __decorate([
    Controller('auth'),
    Throttle({ default: AUTH_THROTTLE }),
    __metadata("design:paramtypes", [AuthService])
], AuthController);
export { AuthController };
//# sourceMappingURL=auth.controller.js.map