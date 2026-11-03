import { createParamDecorator } from '@nestjs/common';
export const CurrentUserId = createParamDecorator((_data, context) => context.switchToHttp().getRequest().userId);
//# sourceMappingURL=current-user-id.decorator.js.map