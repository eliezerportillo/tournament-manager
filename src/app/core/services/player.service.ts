import { Injectable, } from '@angular/core';
import { AngularFirestoreCollection, AngularFirestore, } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';
import { Player } from '../../core/models/player';
import { Stats } from '../../core/models/stats';

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

  players$: Observable<Player[]>;

  constructor(private db: AngularFirestore) {
    this.playersCollection = this.db.collection<Player>('Jugadores');

    this.players$ = this.playersCollection.valueChanges();
  }

  async getGoalKeepers(teamName: string) {
    const snapshot = await this.playersCollection.ref.orderBy('portero').where('equipo', '==', teamName).where('portero', '==', 1).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getPlayersByTeam(teamName: string) {
    const snapshot = await this.playersCollection.ref.orderBy('jugador').where('equipo', '==', teamName).get();
    return snapshot.docs.map(doc => doc.data());
  }

  async getPlayerByEmail(email: string) {
    return (await this.getFiltered('correo', '==', email))[0];
  }

  async getCaptains() {
    return this.getFiltered('capitan');
  }

  async getPlayersStats(): Promise<Stats> {
    const promises = [
      this.getFiltered('goles'),
      this.getFiltered('amarillas'),
      this.getFiltered('rojas')
    ];
    const responses = await Promise.all(promises);

    const s: Stats = {
      goals: responses[0],
      yellows: responses[1],
      reds: responses[2],

    }

    return s;
  }

  private async getFiltered(filterBy: string, op: WhereFilterOp = '>', value: unknown = 0) {
    const snapshot = await this.playersCollection.ref.orderBy(filterBy).orderBy('jugador').where(filterBy, op, value).get();
    return snapshot.docs.map(doc => doc.data());
  }


}
