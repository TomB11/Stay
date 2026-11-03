import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import type { NestExpressApplication } from '@nestjs/platform-express';
import helmet from 'helmet';
import { AppModule } from './app.module.js';

for (const file of ['.env', '.env.local']) {
  if (existsSync(file)) process.loadEnvFile(file);
}

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);
  // Behind Render's proxy, so rate limiting sees the real client IP.
  app.set('trust proxy', 1);
  app.use(helmet());
  app.setGlobalPrefix('api');
  app.enableCors({
    origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200',
  });
  await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
