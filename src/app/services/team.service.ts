import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, map } from 'rxjs';
import { Match } from '../models/match';
import { Team } from '../models/team';
import firebase from 'firebase/compat';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamsCollection: AngularFirestoreCollection<Team>;
  teams$: Observable<Team[]>;

  constructor(private db: AngularFirestore) {
    this.teamsCollection = this.db.collection<Team>('Equipos', this.getOrdered);
    this.teams$ = this.teamsCollection.valueChanges();
  }



  getTeams(): Observable<Team[]> {
    return this.teams$;
  }

  private getOrdered(ref: CollectionReference<DocumentData>): Query<DocumentData> {
    return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('nombre');
  }

}
