import { Module } from '@nestjs/common';
import { FirebaseService } from 'src/base/database/firebase.service';

@Module({
  providers: [FirebaseService],
  exports: [FirebaseService],
})
export class FirebaseModule {}
