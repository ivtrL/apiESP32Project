import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardController } from 'src/base/controllers/card';
import { VerifyJwtMiddleware } from 'src/common/middleware/verifyAccessJWT';
import { PrismaService } from 'src/base/database/prisma';
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
      .apply(VerifyJwtMiddleware)
      .exclude('api/(.*)')
      .forRoutes(CardController);
  }
}
