import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData, QueryFn } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';

import { ITeam } from '../models/team';
import { firstValueFrom } from 'rxjs';
import { LineUp } from '../models/lineup';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamsCollection: AngularFirestoreCollection<ITeam>;
  
  teams$: Observable<ITeam[]>;

  constructor(private db: AngularFirestore) {
    this.teamsCollection = this.db.collection<ITeam>('Equipos', this.getOrdered);
    
    this.teams$ = this.teamsCollection.valueChanges();
  }



  getTeams(): Observable<ITeam[]> {
    return this.teams$;
  }



  private getOrdered(ref: CollectionReference<DocumentData>): Query<DocumentData> {
    return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('nombre');
  }

}
