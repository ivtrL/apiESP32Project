import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CardController } from '../controllers/card.controller';
import { verifyAccessJWTMiddleware } from 'src/middleware/verifyAccessJWT.middleware';
import { PrismaService } from 'src/database/prisma.service';
import { DatabaseService } from 'src/services/databaseService.service';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [PrismaService, DatabaseService],
})
export class CardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyAccessJWTMiddleware)
      .exclude('api/(.*)')
      .forRoutes(CardController);
  }
}
