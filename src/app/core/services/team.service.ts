import { Injectable, inject } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, CollectionReference, Query, DocumentData } from '@angular/fire/compat/firestore';
import { Observable, filter, firstValueFrom, from, map, of, shareReplay, take, tap } from 'rxjs';

import { ITeam, Team } from '@app-core/models/team';
import { AngularFireStorage } from '@angular/fire/compat/storage';

@Injectable({
  providedIn: 'root'
})
export class TeamService {
  teamsCollection: AngularFirestoreCollection<ITeam>;
  rankedCollection: AngularFirestoreCollection<ITeam>;
  rankedTeams?: ITeam[];
  teams?: ITeam[];
  teams$?: Observable<ITeam[]>;
  ranked$?: Observable<ITeam[]>;
  private storage = inject(AngularFireStorage)



  constructor(private db: AngularFirestore) {
    this.rankedCollection = this.db.collection<ITeam>('Equipos', this.getOrdered);
    this.teamsCollection = this.db.collection<ITeam>('Equipos', ref => ref.orderBy('nombre'));
  }



  getRankedTeams(): Observable<ITeam[]> {
    if (this.ranked$) {
      return this.ranked$;
    }

    this.ranked$ = this.rankedCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(action => {
          return { id: action.payload.doc.id, ...action.payload.doc.data() } as ITeam;
        })
      ),
      tap(teams => {
        console.log(`${teams.length} Rankend Teams read`);
        this.rankedTeams = teams;
      }),
      shareReplay(1)
    );

    return this.ranked$;
  }

  getTeams(): Observable<ITeam[]> {
    if (this.teams$) {
      return this.teams$;
    }

    this.teams$ = this.teamsCollection.snapshotChanges().pipe(
      map(actions =>
        actions.map(action => {
          return { id: action.payload.doc.id, ...action.payload.doc.data() } as ITeam;
        })
      ),
      tap(teams => {
        console.log(`${teams.length} Teams read`);
        this.teams = teams;
      }),
      shareReplay(1)
    );

    return this.teams$;
  }

  private teamImagesCache: { [teamName: string]: string } = {}

  async getTeamImageUrl(teamName: string): Promise<string> {
    if (this.teamImagesCache[teamName]) {
      // console.log('getTeamImageUrl from cache');
      return this.teamImagesCache[teamName];
    }
  
    console.log('getTeamImageUrl');
    const imagePath = Team.createImageUrl(teamName);
    const storageRef = this.storage.ref(imagePath);
    const imageUrl = await firstValueFrom(storageRef.getDownloadURL());
  
    // Actualizar la caché con la nueva URL
    this.teamImagesCache[teamName] = imageUrl;
    return imageUrl;
  }





  private getOrdered(ref: CollectionReference<DocumentData>): Query<DocumentData> {
    return ref.orderBy('Pts', 'desc').orderBy('DG', 'desc').orderBy('GF', 'desc').orderBy('GC').orderBy('nombre');
  }

}
