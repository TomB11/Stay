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
import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUserId } from '../auth/current-user-id.decorator.js';
import { CreateSessionDto } from './dto/create-session.dto.js';
import { SessionsService } from './sessions.service.js';
let SessionsController = class SessionsController {
    sessionsService;
    constructor(sessionsService) {
        this.sessionsService = sessionsService;
    }
    create(userId, input) {
        return this.sessionsService.create(userId, input);
    }
    findAll(userId) {
        return this.sessionsService.findAll(userId);
    }
};
__decorate([
    Post(),
    __param(0, CurrentUserId()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateSessionDto]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "create", null);
__decorate([
    Get(),
    __param(0, CurrentUserId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], SessionsController.prototype, "findAll", null);
SessionsController = __decorate([
    Controller('sessions'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [SessionsService])
], SessionsController);
export { SessionsController };
//# sourceMappingURL=sessions.controller.js.map