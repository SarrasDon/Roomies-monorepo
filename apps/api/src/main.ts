/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 **/

import { NestFactory } from '@nestjs/core';

import { AppModule } from './app/app.module';
import * as CookieParser from 'cookie-parser';
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const globalPrefix = 'api';
  app.setGlobalPrefix(globalPrefix);
  app.enableCors({
    credentials: true,
    origin: ['http://localhost:4200', 'https://roomies.netlify.com']
  });
  app.use(CookieParser('secret'));

  const port = process.env['PORT'] || 3000;
  await app.listen(port, () => {
    console.log('Listening at ' + port + '/' + globalPrefix);
  });
}

bootstrap();
