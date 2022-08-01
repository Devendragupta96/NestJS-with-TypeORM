import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as cookieParser from 'cookie-parser';
//import cookieSession from 'cookie-session';
const cookieSession = require('cookie-session');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(cookieSession({
    keys: ['asdsdfsad']
  }),
  );
  app.useGlobalPipes(new ValidationPipe({
    whitelist: true
  }),
  );
  app.use(cookieParser());

  const config = new DocumentBuilder()
    .setTitle('User Api')
    .setDescription('Api to work on user')
    .addBearerAuth()
    .setVersion('1.0')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  await app.listen(3000);
}
bootstrap();
