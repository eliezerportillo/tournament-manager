import { Injectable } from '@angular/core';

import { ISponsor } from '../models/sponsor';
import { FirestoreService } from './firestore.service';
import { AngularFirestoreDocument } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class SponsorService extends FirestoreService<ISponsor> {

  constructor() {
    super('Patrocinadores', ref => ref.orderBy('priority'));
  }

  async add(sponsor: ISponsor) {
    let doc: AngularFirestoreDocument;
    if (sponsor.id) {
      doc = this.collection.doc(sponsor.id);
    } else {
      doc = this.collection.doc();
    }
    await doc.set(sponsor);
  }

  async delete(sponsor: ISponsor) {
    let doc: AngularFirestoreDocument;

    doc = this.collection.doc(sponsor.id);
    if (doc) {
      await doc.delete();
    }
  }
}

