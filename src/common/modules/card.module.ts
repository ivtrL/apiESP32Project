import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardController } from 'src/base/controllers/card.controller';
import { verifyAccessJWTMiddleware } from 'src/common/middleware/verifyAccessJWT.middleware';
import { PrismaService } from 'src/base/database/prisma.service';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [PrismaService],
})
export class CardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyAccessJWTMiddleware)
      .exclude('api/(.*)')
      .forRoutes(CardController);
  }
}
