import { Module } from '@nestjs/common';
import { FirebaseModule } from './firebase.module';
import { ImageService } from '../services/image.service';
import { ImageController } from 'src/base/controllers/image.controller';

@Module({
  imports: [FirebaseModule],
  controllers: [ImageController],
  providers: [ImageService],
})
export class ImageModule {}
