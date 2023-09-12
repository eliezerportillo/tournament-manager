import { Injectable, } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, } from '@angular/fire/compat/firestore';
import { Observable, firstValueFrom, map, of } from 'rxjs';
import { Player } from '@app-core/models/player';
import { Stats } from '@app-core/models/stats';

type WhereFilterOp =
  | '<'
  | '<='
  | '=='
  | '!='
  | '>='
  | '>'
  | 'array-contains'
  | 'in'
  | 'array-contains-any'
  | 'not-in';

@Injectable({
  providedIn: 'root'
})
export class PlayerService {

  playersCollection: AngularFirestoreCollection<Player>;
  stats?: Stats;



  constructor(private db: AngularFirestore) {
    this.playersCollection = this.db.collection<Player>('Jugadores');
  }

  async getGoalKeepers(teamName: string): Promise<Player[]> {
    const snapshot = await this.playersCollection.ref.orderBy('portero').where('equipo', '==', teamName).where('portero', '==', 1).get();
    return snapshot.docs.map(doc => doc.data());
  }

  getPlayersByTeam(teamName: string): Observable<Player[]> {
    return this.db.collection<Player>('Jugadores', ref => ref.orderBy('jugador').where('equipo', '==', teamName))
      .snapshotChanges()
      .pipe(
        map(actions =>
          actions.map(action => {
            return { id: action.payload.doc.id, ...action.payload.doc.data() } as Player;
          })
        )
      );
  }

  async getPlayerByEmail(email: string): Promise<Player> {
    return (await this.getFiltered('correo', '==', email))[0];
  }

  async getCaptains(): Promise<Player[]> {
    return this.getFiltered('capitan');
  }

  async getPlayersStats(): Promise<Stats> {
    if (this.stats) {
      return firstValueFrom(of(this.stats));
    }

    const promises = [
      this.getFiltered('goles'),
      this.getFiltered('amarillas'),
      this.getFiltered('rojas')
    ];
    const responses = await Promise.all(promises);

    const stats: Stats = {
      goals: responses[0],
      yellows: responses[1],
      reds: responses[2],
    }

    this.stats = stats;

    return stats;
  }

  private async getFiltered(filterBy: string, op: WhereFilterOp = '>', value: unknown = 0) {
    const snapshot = await this.playersCollection.ref.orderBy(filterBy).orderBy('jugador').where(filterBy, op, value).get();
    const data = snapshot.docs.map(doc => doc.data());
    console.log(`${data.length} Players read filtered by ${filterBy} ${op} ${value}`);
    return data;
  }


}
