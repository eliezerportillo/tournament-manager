import { Injectable, inject } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';


@Injectable({
  providedIn: 'root'
})
export class BatchItemCreatorCommand {

  db = inject(AngularFirestore);

  constructor() { }

  async execute(items: any[]) {
    const collectionRef = this.db.firestore.collection('Jugadores');

    // Using batch to perform a batch write for faster insertion
    const batch = this.db.firestore.batch();

    items.forEach((item) => {
      const docRef = collectionRef.doc(); // Auto-generated document ID
      batch.set(docRef, item);
    });

    await batch.commit();
  }
}
