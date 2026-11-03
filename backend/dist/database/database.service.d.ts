import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
export declare class DatabaseService implements OnModuleInit, OnModuleDestroy {
    private pool?;
    private memory?;
    onModuleInit(): Promise<void>;
    query<T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]>;
    onModuleDestroy(): Promise<void>;
}
