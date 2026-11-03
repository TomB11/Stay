var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsIn, IsInt, IsString, Max, MaxLength, Min } from 'class-validator';
import { MAX_INTENSITY, MAX_SITUATION_LENGTH, MIN_INTENSITY, SESSION_FEEDBACKS, SESSION_PHASES, } from '../constants/session-limits.constant.js';
export class CreateSessionDto {
    phase;
    situation;
    initialIntensity;
    finalIntensity;
    feedback;
}
__decorate([
    IsIn(SESSION_PHASES),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "phase", void 0);
__decorate([
    IsString(),
    MaxLength(MAX_SITUATION_LENGTH),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "situation", void 0);
__decorate([
    IsInt(),
    Min(MIN_INTENSITY),
    Max(MAX_INTENSITY),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "initialIntensity", void 0);
__decorate([
    IsInt(),
    Min(MIN_INTENSITY),
    Max(MAX_INTENSITY),
    __metadata("design:type", Number)
], CreateSessionDto.prototype, "finalIntensity", void 0);
__decorate([
    IsIn(SESSION_FEEDBACKS),
    __metadata("design:type", String)
], CreateSessionDto.prototype, "feedback", void 0);
//# sourceMappingURL=create-session.dto.js.map