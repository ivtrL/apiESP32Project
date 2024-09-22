import { initializeApp } from 'firebase/app';
import { FirebaseStorage, getStorage } from 'firebase/storage';
import { Injectable } from '@nestjs/common';
import firebaseConfig from './firebase.config';

@Injectable()
export class FirebaseService {
  private readonly storage: FirebaseStorage;

  constructor() {
    initializeApp(firebaseConfig);
    this.storage = getStorage();
  }

  getStorageInstance() {
    return this.storage;
  }
}
