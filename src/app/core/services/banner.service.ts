import { Injectable, inject } from '@angular/core';
import { ModalService } from './modal.service';
import { FirestoreService } from './firestore.service';
import { IBanner } from '@app-core/models/banner';
import { Observable, shareReplay } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BannerService extends FirestoreService<IBanner>{


  constructor() {
    super('banners');
  }

  getActiveBanners() {
    return this.get(ref => ref.where('active', '==', 1));
  }
}
