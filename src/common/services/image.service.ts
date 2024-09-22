import { Injectable } from '@nestjs/common';
import {
  getDownloadURL,
  ref,
  uploadBytesResumable,
  deleteObject,
} from 'firebase/storage';
import { FirebaseService } from 'src/base/database/firebase.service';

@Injectable()
export class ImageService {
  constructor(private readonly firebaseService: FirebaseService) {}

  async uploadImage(
    file: Express.Multer.File,
    temporary = false,
  ): Promise<string> {
    const storage = this.firebaseService.getStorageInstance();

    const dateTime = new Date().getTime();

    const storageRef = ref(
      storage,
      `${temporary ? 'temporary' : 'files'}/${dateTime}_${file.originalname}`,
    );

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

  async deleteImage(url: string, temporary = false): Promise<void> {
    const storage = this.firebaseService.getStorageInstance();
    const imageName = url.split('%2F')[1].split('?')[0];
    const imageRef = ref(
      storage,
      `${temporary ? 'temporary' : 'files'}/${imageName}`,
    );
    await deleteObject(imageRef);
  }
}
