
import { inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/compat/firestore';
import { Observable, map, tap } from 'rxjs';

export abstract class FirestoreService<T> {
  db: AngularFirestore = inject(AngularFirestore);
  protected collection: AngularFirestoreCollection<T>;
  constructor(private collectionName: string) {
    this.collection = this.db.collection<T>(collectionName);
  }

  get(): Observable<T[]> {
    return this.collection
      .snapshotChanges().pipe(
        tap(matches => {
          console.log(`${matches.length} ${this.collectionName} read`);
        }),
        map(actions =>
          actions.map(action => {
            return { id: action.payload.doc.id, ...action.payload.doc.data() } as T;
          })
        )
      );;
  }
}