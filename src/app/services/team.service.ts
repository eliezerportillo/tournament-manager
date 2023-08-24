import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

import { ITeam } from '../models/team';

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
    return this.rankedTeams$;
  }

  getTeams(): Observable<ITeam[]> {
    return this.teams$;
  }



  private getOrdered(ref: CollectionReference<DocumentData>): Query<DocumentData> {
    return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('GC').orderBy('nombre');
  }

}
