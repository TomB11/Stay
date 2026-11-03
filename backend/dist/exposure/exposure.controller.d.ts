import { CreateExposureAttemptDto } from './dto/create-exposure-attempt.dto.js';
import { CreateExposureStepDto } from './dto/create-exposure-step.dto.js';
import { ExposureService } from './exposure.service.js';
import type { ExposureAttempt, ExposureStep } from './models/exposure-step.interface.js';
export declare class ExposureController {
    private readonly exposureService;
    constructor(exposureService: ExposureService);
    findAll(userId: string): Promise<ExposureStep[]>;
    createStep(userId: string, input: CreateExposureStepDto): Promise<ExposureStep>;
    addAttempt(userId: string, stepId: string, input: CreateExposureAttemptDto): Promise<ExposureAttempt>;
    removeStep(userId: string, stepId: string): Promise<void>;
}
