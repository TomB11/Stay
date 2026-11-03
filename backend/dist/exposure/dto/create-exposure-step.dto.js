var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
import { IsInt, IsString, Max, MaxLength, Min, MinLength } from 'class-validator';
import { MAX_ANXIETY, MAX_STEP_TITLE_LENGTH, MIN_ANXIETY, } from '../constants/exposure-limits.constant.js';
export class CreateExposureStepDto {
    title;
    expectedAnxiety;
}
__decorate([
    IsString(),
    MinLength(1),
    MaxLength(MAX_STEP_TITLE_LENGTH),
    __metadata("design:type", String)
], CreateExposureStepDto.prototype, "title", void 0);
__decorate([
    IsInt(),
    Min(MIN_ANXIETY),
    Max(MAX_ANXIETY),
    __metadata("design:type", Number)
], CreateExposureStepDto.prototype, "expectedAnxiety", void 0);
//# sourceMappingURL=create-exposure-step.dto.js.map