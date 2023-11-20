import { NestFactory } from '@nestjs/core';
import { CardModule } from './common/modules/card.module';
import { ValidationPipe } from '@nestjs/common';
import * as dotenv from 'dotenv';

dotenv.config({ path: '../.env' });

async function bootstrap() {
  const app = await NestFactory.create(CardModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
