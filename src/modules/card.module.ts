import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CardController } from '../controllers/card.controller';
import { verifyAccessJWTMiddleware } from 'src/middleware/verifyAccessJWT.middleware';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [],
})
export class CardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyAccessJWTMiddleware)
      .exclude(
        { path: 'api', method: RequestMethod.ALL },
        { path: 'api/login', method: RequestMethod.ALL },
      )
      .forRoutes(CardController);
  }
}
