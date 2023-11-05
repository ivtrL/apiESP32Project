import { NestFactory } from '@nestjs/core';
import { CardModule } from './common/modules/card.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(CardModule);
  app.useGlobalPipes(new ValidationPipe());
  app.enableShutdownHooks();

  await app.listen(3000);
}
bootstrap();
