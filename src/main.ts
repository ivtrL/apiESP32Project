import { NestFactory } from '@nestjs/core';
import { CardModule } from './modules/card.module';

async function bootstrap() {
  const app = await NestFactory.create(CardModule);
  await app.listen(3000);
}
bootstrap();
