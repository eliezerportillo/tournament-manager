import { Injectable } from '@angular/core';
import { FirestoreService } from './firestore.service';
import { IBadge } from '@app-core/models/bagde';

@Injectable({
  providedIn: 'root'
})
export class BadgeService extends FirestoreService<IBadge> {

  constructor() { 
    super('badges');
  }

  async deleteBadges(badges: IBadge[]) {
    const batch = this.db.firestore.batch();
    for (const badge of badges) {
      const ref = this.db.firestore.collection('badges').doc(badge.id);
      batch.delete(ref);
    }

    return batch.commit();

  }
}
