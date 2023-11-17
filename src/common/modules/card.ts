import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardController } from 'src/base/controllers/card.controller';
import { verifyAccessJWTMiddleware } from 'src/common/middleware/verifyAccessJWT.middleware';
import { PrismaService } from 'src/base/database/prisma.service';
import {
  AbstractCardRepository,
  AbstractDeviceRepository,
  AbstractLogRepository,
  AbstractTimeRepository,
  AbstractUserRepository,
} from 'src/base/repositories';
import { CardRepository } from 'src/base/repositories/prisma/CardRepository';
import { UserRepository } from 'src/base/repositories/prisma/UserRepository';
import { DeviceRepository } from 'src/base/repositories/prisma/DeviceRepository';
import { TimeRepository } from 'src/base/repositories/prisma/TimeRepository';
import { LogRepository } from 'src/base/repositories/prisma/LogRepository';
import { verifyRefreshJWTMiddleware } from '../middleware/verifyRefreshJWT.middleware';
import { AuthController } from 'src/base/controllers/auth.controller';

@Module({
  imports: [],
  controllers: [CardController],
  providers: [
    PrismaService,
    {
      provide: AbstractCardRepository,
      useClass: CardRepository,
    },
    {
      provide: AbstractUserRepository,
      useClass: UserRepository,
    },
    {
      provide: AbstractDeviceRepository,
      useClass: DeviceRepository,
    },
    {
      provide: AbstractTimeRepository,
      useClass: TimeRepository,
    },
    {
      provide: AbstractLogRepository,
      useClass: LogRepository,
    },
  ],
})
export class CardModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(verifyAccessJWTMiddleware)
      .exclude('api/(.*)')
      .forRoutes(CardController);

    consumer.apply(verifyRefreshJWTMiddleware).forRoutes(AuthController);
  }
}
