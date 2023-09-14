import { Injectable } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, map, of, tap } from 'rxjs';

import { ITeam } from '@app-core/models/team';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamsCollection: AngularFirestoreCollection<ITeam>;
  rankedCollection: AngularFirestoreCollection<ITeam>;
  rankedTeams?: ITeam[];
  teams?: ITeam[];


  constructor(private db: AngularFirestore) {
    this.rankedCollection = this.db.collection<ITeam>('Equipos', this.getOrdered);
    this.teamsCollection = this.db.collection<ITeam>('Equipos', ref => ref.orderBy('nombre'));
  }



  getRankedTeams(): Observable<ITeam[]> {
    if (this.rankedTeams) {
      return of(this.rankedTeams);
    }

    return this.rankedCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(action => {
          return { id: action.payload.doc.id, ...action.payload.doc.data() } as ITeam;
        })
      ),
      tap(teams => {
        console.log(`${teams.length} Rankend Teams read`);
        this.rankedTeams = teams;
      }),
    );
  }

  getTeams(): Observable<ITeam[]> {
    if (this.teams) {
      return of(this.teams);
    }

    return this.teamsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(action => {
          return { id: action.payload.doc.id, ...action.payload.doc.data() } as ITeam;
        })
      ),
      tap(teams => {
        console.log(`${teams.length} Teams read`);
        this.teams = teams;
      })
    );
  }

  async getTeam(team: string) {
    const d = await this.teamsCollection.ref.where('equipo', '==', team).limit(1).get();

    return d.docs.map(doc => ({ id: doc.id, ...doc.data() } as ITeam))[0];
  }



  private getOrdered(ref: CollectionReference<DocumentData>): Query<DocumentData> {
    return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('GC').orderBy('nombre');
  }

}
