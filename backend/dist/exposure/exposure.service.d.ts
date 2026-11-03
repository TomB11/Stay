import { DatabaseService } from '../database/database.service.js';
import { CreateExposureAttemptDto } from './dto/create-exposure-attempt.dto.js';
import { CreateExposureStepDto } from './dto/create-exposure-step.dto.js';
import type { ExposureAttempt, ExposureStep } from './models/exposure-step.interface.js';
export declare class ExposureService {
    private readonly database;
    constructor(database: DatabaseService);
    findAll(userId: string): Promise<ExposureStep[]>;
    createStep(userId: string, input: CreateExposureStepDto): Promise<ExposureStep>;
    addAttempt(userId: string, stepId: string, input: CreateExposureAttemptDto): Promise<ExposureAttempt>;
    removeStep(userId: string, stepId: string): Promise<void>;
    private assertOwnsStep;
}
