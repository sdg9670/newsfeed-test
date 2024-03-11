import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  app.use(cookieParser());
  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('Newsfeed API').build(),
  );
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
