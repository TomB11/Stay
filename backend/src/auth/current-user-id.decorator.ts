import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import type { AuthenticatedRequest } from './models/authenticated-request.interface.js';

/** Injects the account id resolved by AuthGuard. */
export const CurrentUserId = createParamDecorator(
  (_data: unknown, context: ExecutionContext): string =>
    context.switchToHttp().getRequest<AuthenticatedRequest>().userId,
);
