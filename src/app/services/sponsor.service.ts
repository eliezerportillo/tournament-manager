import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ISponsor } from '../models/sponsor';
import { FirestoreService } from './firestore.service';

@Injectable({
  providedIn: 'root'
})
export class SponsorService extends FirestoreService<ISponsor> {

  constructor() {
    super('Patrocinadores');
  }
}
 
