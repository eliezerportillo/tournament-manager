import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, map, tap } from 'rxjs';

import { ITeam } from '@app-core/models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamsCollection: AngularFirestoreCollection<ITeam>;
  rankedCollection: AngularFirestoreCollection<ITeam>;
  
  rankedTeams$: Observable<ITeam[]>;
  teams$: Observable<ITeam[]>;

  constructor(private db: AngularFirestore) {
    this.rankedCollection = this.db.collection<ITeam>('Equipos', this.getOrdered);
    this.teamsCollection = this.db.collection<ITeam>('Equipos', ref => ref.orderBy('nombre'));
    
    this.rankedTeams$ = this.rankedCollection.valueChanges();
    this.teams$ = this.teamsCollection.valueChanges();
  }



  getRankedTeams(): Observable<ITeam[]> {
    return this.rankedCollection.snapshotChanges().pipe(
      tap(matches => {
        console.log(`${matches.length} Teams read`);
      }),
      map(actions =>
        actions.map(action => {
          return { id: action.payload.doc.id, ...action.payload.doc.data() } as ITeam;
        })        
      )      
    );    
  }

  getTeams(): Observable<ITeam[]> {
    return this.teams$;
  }



  private getOrdered(ref: CollectionReference<DocumentData>): Query<DocumentData> {
    return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('GC').orderBy('nombre');
  }

}
