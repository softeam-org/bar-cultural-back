import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

import { useContainer } from 'class-validator';
import * as cookieParser from 'cookie-parser';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),
  );

  useContainer(app.select(AppModule), { fallbackOnErrors: true });

  const config = new DocumentBuilder()
    .setTitle('Bar Cultural')
    .setDescription('Bar cultural docs')
    .setVersion('0.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);

  SwaggerModule.setup('api-docs', app, document);

  app.use(cookieParser());

  await app.listen(3000);
}
bootstrap();
