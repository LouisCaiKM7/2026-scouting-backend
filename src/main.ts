import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

config(); // 确保在应用启动前加载环境变量

let app: any;

async function bootstrap() {
  app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: true, // Allow all origins for Vercel
    credentials: true,
  });
  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  await app.init();

  return app.getHttpAdapter().getInstance();
}

// For local development
if (require.main === module) {
  bootstrap().then(() => {
    console.log('NestJS app started locally');
  });
}

// Export for Vercel serverless
export default async function handler(req: any, res: any) {
  if (!app) {
    const server = await bootstrap();
    app = server;
  }

  // Vercel handles the HTTP server, we just need to return the app
  return app(req, res);
}
