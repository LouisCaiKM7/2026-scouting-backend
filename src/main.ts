import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { config } from 'dotenv';

config(); // 确保在应用启动前加载环境变量

let app: any;

async function bootstrap() {
  app = await NestFactory.create(AppModule);

  // 详细的 CORS 配置
  app.enableCors({
    origin: function (_origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) {
      // 允许所有来源（生产环境）
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: [
      'Origin',
      'X-Requested-With',
      'Content-Type',
      'Accept',
      'Authorization',
      'Access-Control-Request-Method',
      'Access-Control-Request-Headers'
    ],
    exposedHeaders: ['Authorization', 'Access-Control-Allow-Origin'],
    maxAge: 86400, // 24 hours
    preflightContinue: false,
    optionsSuccessStatus: 204
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
