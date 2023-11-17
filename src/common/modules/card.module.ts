import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { CardController } from 'src/base/controllers/card.controller';
import { VerifyJwtMiddleware } from 'src/common/middleware/verifyAccessJWT.middleware';
import { PrismaService } from 'src/base/database/prisma.service';
import {
  AbstractAdminRepository,
  AbstractCardRepository,
  AbstractDeviceRepository,
  AbstractUserRepository,
} from 'src/base/repositories';
import { CardRepository } from 'src/base/repositories/prisma/CardRepository';
import { AdminController } from 'src/base/controllers/admin.controller';
import { AuthController } from 'src/base/controllers/auth.controller';
import { UserController } from 'src/base/controllers/user.controller';
import { DeviceController } from 'src/base/controllers/device.controller';
import { UserRepository } from 'src/base/repositories/prisma/UserRepository';
import { DeviceRepository } from 'src/base/repositories/prisma/DeviceRepository';
import { AdminRepository } from 'src/base/repositories/prisma/AdminRepository';

@Module({
  imports: [],
  controllers: [
    CardController,
    AdminController,
    AuthController,
    UserController,
    DeviceController,
  ],
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
      provide: AbstractAdminRepository,
      useClass: AdminRepository,
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
