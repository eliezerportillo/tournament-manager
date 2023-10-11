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
}
