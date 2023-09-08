
import { inject } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, map, tap } from 'rxjs';

export abstract class FirestoreService<T> {
  db: AngularFirestore = inject(AngularFirestore);
  protected collection: AngularFirestoreCollection<T>;
  constructor(private collectionName: string, queryFn?: QueryFn) {
    this.collection = this.db.collection<T>(collectionName, queryFn);
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
      );
  }
}