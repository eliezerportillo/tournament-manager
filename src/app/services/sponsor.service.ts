import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { ISponsor } from '../models/sponsor';
import { FirestoreService } from './firestore.service';
import { CreateSponsor } from '../admin/sponsors/sponsor-create/sponsor-create.component';

@Injectable({
  providedIn: 'root'
})
export class SponsorService extends FirestoreService<ISponsor> {

  constructor() {
    super('Patrocinadores');
  }

  async add(sponsor: ISponsor) {
    const doc = this.collection.doc();
    await doc.set(sponsor);
  }
}

