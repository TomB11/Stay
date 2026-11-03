import { existsSync } from 'node:fs';
import { NestFactory } from '@nestjs/core';
import helmet from 'helmet';
import { AppModule } from './app.module.js';
for (const file of ['.env', '.env.local']) {
    if (existsSync(file))
        process.loadEnvFile(file);
}
async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    app.set('trust proxy', 1);
    app.use(helmet());
    app.setGlobalPrefix('api');
    app.enableCors({
        origin: process.env.FRONTEND_ORIGIN ?? 'http://localhost:4200',
    });
    await app.listen(process.env.PORT ?? 3000);
}
await bootstrap();
//# sourceMappingURL=main.js.map