import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
// Note: global prefix "api" helps if we ever serve static assets from the same host.

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.enableCors({
    // Keep this env-driven to make frontend dev painless and prod safer.
    origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // strip unknown fields
      transform: true,            // convert payloads to DTO types
      forbidNonWhitelisted: true, // surface unexpected input early
    }),
  );

  const config = new DocumentBuilder()
    .setTitle('Book Club API')
    .setDescription('CRUD for authors and books')
    .setVersion('1.0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  const port = Number(process.env.PORT || 3000);
  await app.listen(port);
  // eslint-disable-next-line no-console
  console.log(`API ready at http://localhost:${port}/api (docs at /docs)`);
}
bootstrap();