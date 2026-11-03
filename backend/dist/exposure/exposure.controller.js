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
import { Body, Controller, Delete, Get, HttpCode, Param, ParseUUIDPipe, Post, UseGuards, } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard.js';
import { CurrentUserId } from '../auth/current-user-id.decorator.js';
import { CreateExposureAttemptDto } from './dto/create-exposure-attempt.dto.js';
import { CreateExposureStepDto } from './dto/create-exposure-step.dto.js';
import { ExposureService } from './exposure.service.js';
let ExposureController = class ExposureController {
    exposureService;
    constructor(exposureService) {
        this.exposureService = exposureService;
    }
    findAll(userId) {
        return this.exposureService.findAll(userId);
    }
    createStep(userId, input) {
        return this.exposureService.createStep(userId, input);
    }
    addAttempt(userId, stepId, input) {
        return this.exposureService.addAttempt(userId, stepId, input);
    }
    removeStep(userId, stepId) {
        return this.exposureService.removeStep(userId, stepId);
    }
};
__decorate([
    Get(),
    __param(0, CurrentUserId()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExposureController.prototype, "findAll", null);
__decorate([
    Post(),
    __param(0, CurrentUserId()),
    __param(1, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, CreateExposureStepDto]),
    __metadata("design:returntype", Promise)
], ExposureController.prototype, "createStep", null);
__decorate([
    Post(':id/attempts'),
    __param(0, CurrentUserId()),
    __param(1, Param('id', ParseUUIDPipe)),
    __param(2, Body()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, CreateExposureAttemptDto]),
    __metadata("design:returntype", Promise)
], ExposureController.prototype, "addAttempt", null);
__decorate([
    Delete(':id'),
    HttpCode(204),
    __param(0, CurrentUserId()),
    __param(1, Param('id', ParseUUIDPipe)),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], ExposureController.prototype, "removeStep", null);
ExposureController = __decorate([
    Controller('exposure'),
    UseGuards(AuthGuard),
    __metadata("design:paramtypes", [ExposureService])
], ExposureController);
export { ExposureController };
//# sourceMappingURL=exposure.controller.js.map