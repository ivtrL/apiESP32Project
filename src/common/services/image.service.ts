import { Injectable } from '@nestjs/common';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { FirebaseService } from 'src/base/database/firebase.service';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadImage(file: Express.Multer.File): Promise<string> {
    const storage = this.firebaseService.getStorageInstance();

    const dateTime = new Date().getTime();
    const storageRef = ref(storage, `files/${dateTime}_${file.originalname}`);

    const metadata = {
      contentType: file.mimetype,
    };

    const fileUpload = await uploadBytesResumable(
      storageRef,
      file.buffer,
      metadata,
    );

    const url = await getDownloadURL(fileUpload.ref);

    return url;
  }
}
