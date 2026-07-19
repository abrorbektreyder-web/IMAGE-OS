import { NestFactory } from '@nestjs/core';
import {
  FastifyAdapter,
  NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter({ logger: true, bodyLimit: 50 * 1024 * 1024 }), // 50MB limit for base64 images
  );

  // CORS — allow Next.js frontend (local dev + Vercel production)
  const allowedOrigins = [
    'http://localhost:3000',
    'https://image-os-web.vercel.app',
  ];
  if (process.env.NEXT_PUBLIC_APP_URL) {
    allowedOrigins.push(process.env.NEXT_PUBLIC_APP_URL);
  }
  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
  });

  // Global validation pipe (class-validator)
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // API versioning prefix
  app.setGlobalPrefix('api/v1');

  const port = process.env.PORT ?? 4000;
  await app.listen(port, '0.0.0.0');

  console.log(`🚀 ImageOS API running on http://localhost:${port}/api/v1`);
}

bootstrap();
